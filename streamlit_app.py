import streamlit as st
import time, os, threading
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from CryptoTrader.trading.websocket_stream import KlineCollector
from CryptoTrader.trading.indicators import add_indicators
from CryptoTrader.trading.strategy import add_signals
from CryptoTrader.trading.backtester import backtest
from CryptoTrader.ml.train_and_predict_auto import train_in_background, build_features
import joblib
from chatbot import chatbot_ui  # <-- Import your chatbot module

# ----------------- Initialization -----------------
st.set_page_config(layout="wide", page_title="Crypto Trader + Chatbot")
st.title("📊 Crypto Trader — Auto-download & Auto-train + 🤖 Chatbot")

# Initialize session state
if "collectors" not in st.session_state:
    st.session_state.collectors = {}
if "models_status" not in st.session_state:
    st.session_state.models_status = {}

training_results = {}
training_lock = threading.Lock()

# ----------------- Sidebar -----------------
with st.sidebar:
    st.header("⚙️ Settings")
    symbols_input = st.text_input("Symbols (comma-separated)", value="BTCUSDT,ETHUSDT,BNBUSDT")
    interval = st.selectbox("Interval", ["1m", "3m", "5m", "15m"], index=0)
    max_candles = st.number_input("Max candles per symbol", min_value=200, max_value=2000, value=1200)
    retrain_minutes = st.number_input("Retrain every N minutes", min_value=0, max_value=240, value=30,
                                      help="0 = no periodic retrain")
    
    
# ----------------- Chatbot Sidebar -----------------
st.sidebar.markdown("---")
st.sidebar.subheader("💬 Chatbot")
chatbot_ui()  # <-- Embed your chatbot in the sidebar

# ----------------- Parse symbols -----------------
symbols = [s.strip().upper() for s in symbols_input.split(",") if s.strip()]
if not symbols:
    st.error("❌ Enter at least one symbol (e.g., BTCUSDT)")
    st.stop()

# ----------------- Stream Controls -----------------
col1, col2 = st.columns(2)
with col1:
    if st.button("▶️ Start All Streams"):
        for sym in symbols:
            if sym not in st.session_state.collectors:
                coll = KlineCollector(symbol=sym, interval=interval, maxlen=int(max_candles))
                coll.start()
                st.session_state.collectors[sym] = coll
        st.success("✅ Streams started. Models will auto-train in background.")

with col2:
    if st.button("⏹ Stop All Streams"):
        for sym, coll in list(st.session_state.collectors.items()):
            try:
                coll.stop()
            except:
                pass
        st.session_state.collectors = {}
        st.success("🛑 Streams stopped.")

# ----------------- Symbol Selection -----------------
view_symbol = st.selectbox("📈 Symbol to view", symbols)
collector = st.session_state.collectors.get(view_symbol)
if collector is None:
    st.info("ℹ️ Start streams first, then select a symbol to view.")
    st.stop()

# ----------------- Training Handling -----------------
model_path = os.path.join("models", f"model_{view_symbol}.pkl")
if view_symbol not in st.session_state.models_status:
    st.session_state.models_status[view_symbol] = {"status": "not_started", "last_trained": None}

def training_callback(sym, path, err):
    with training_lock:
        training_results[sym] = {
            "last_trained": path if path else None,
            "status": "ready" if path else f"error: {err}",
            "last_trained_ts": time.time()
        }

if st.session_state.models_status[view_symbol]["status"] == "not_started":
    st.session_state.models_status[view_symbol]["status"] = "training"
    train_in_background(view_symbol, interval=interval, callback=training_callback)

if retrain_minutes > 0:
    last_ts = st.session_state.models_status[view_symbol].get("last_trained_ts", 0)
    if time.time() - last_ts > retrain_minutes * 60:
        st.session_state.models_status[view_symbol]["status"] = "retraining"
        train_in_background(view_symbol, interval=interval, callback=training_callback)

with training_lock:
    for sym, result in training_results.items():
        if sym not in st.session_state.models_status:
            st.session_state.models_status[sym] = {}
        st.session_state.models_status[sym].update(result)
    training_results.clear()

# ----------------- Data Fetch -----------------
df = collector.get_dataframe()
if df.empty:
    st.info("⌛ Waiting for candles...")
    st.stop()

df_ind = add_indicators(df)
df_sig = add_signals(df_ind)

# ----------------- ML Prediction -----------------
ml_status = st.session_state.models_status[view_symbol]["status"]
ml_text = ml_status
ml_pred, ml_proba = None, None

if os.path.exists(model_path):
    try:
        model = joblib.load(model_path)
        X, _, _ = build_features(df)
        if not X.empty:
            pred = model.predict(X.tail(1))[0]
            proba = model.predict_proba(X.tail(1))[0][1] if hasattr(model, "predict_proba") else None
            ml_pred = "Buy" if int(pred) == 1 else "Sell"
            ml_proba = float(proba) if proba is not None else None
            ml_text = f"{ml_pred} (p={ml_proba:.2f})"
    except Exception as e:
        ml_text = f"prediction error: {e}"

# ----------------- Plotly Chart -----------------
plot_df = df_sig.tail(300)
fig = make_subplots(rows=2, cols=1, shared_xaxes=True, row_heights=[0.75, 0.25], vertical_spacing=0.03)
fig.add_trace(go.Candlestick(x=plot_df.index, open=plot_df["open"], high=plot_df["high"],
                             low=plot_df["low"], close=plot_df["close"], name="Candles"), row=1, col=1)
fig.add_trace(go.Scatter(x=plot_df.index, y=plot_df["ema_short"], mode="lines", name="EMA short"), row=1, col=1)
fig.add_trace(go.Scatter(x=plot_df.index, y=plot_df["ema_long"], mode="lines", name="EMA long"), row=1, col=1)

buys = plot_df[plot_df["Recommendation"] == "Buy"]
sells = plot_df[plot_df["Recommendation"] == "Sell"]
if not buys.empty:
    fig.add_trace(go.Scatter(x=buys.index, y=buys["high"] * 1.001, mode="markers",
                             marker_symbol="triangle-up", marker_size=10, name="Rule-Buy"), row=1, col=1)
if not sells.empty:
    fig.add_trace(go.Scatter(x=sells.index, y=sells["low"] * 0.999, mode="markers",
                             marker_symbol="triangle-down", marker_size=10, name="Rule-Sell"), row=1, col=1)

fig.add_trace(go.Scatter(x=plot_df.index, y=plot_df["rsi"], mode="lines", name="RSI"), row=2, col=1)
fig.add_hline(y=70, line_dash="dash", row=2, col=1)
fig.add_hline(y=30, line_dash="dash", row=2, col=1)

fig.update_layout(height=750, margin=dict(l=10, r=10, t=40, b=10), xaxis_rangeslider_visible=False)
st.plotly_chart(fig, use_container_width=True)

# ----------------- Sidebar Info -----------------
st.sidebar.subheader("🤖 Model status")
st.sidebar.write(f"{view_symbol}: {ml_text}")
st.sidebar.markdown("---")

last = df_sig.iloc[-1]
st.sidebar.subheader("📌 Latest")
st.sidebar.write(f"Time: {last.name}")
st.sidebar.write(f"Rule: {last.Recommendation} | Conf: {last.Confidence:.2f} | Risk: {last.Risk:.2f}")
st.sidebar.write(f"ML: {ml_text}")

# ----------------- Quick Backtest -----------------
df_bt = df_sig.tail(200)
final_val, trades, equity = backtest(df_bt)
st.subheader("📊 Quick Strategy Performance (last 200 candles)")
st.write(f"Final portfolio value (start 1000): {final_val:.2f} USDT | Trades: {len(trades)}")
st.line_chart(equity)

# ----------------- Auto Refresh -----------------
if st.checkbox("🔄 Auto refresh (1s)", value=True):
    time.sleep(1.0)
    st.rerun()
