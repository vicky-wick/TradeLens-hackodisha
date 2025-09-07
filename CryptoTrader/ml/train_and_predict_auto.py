import threading, os, joblib, time
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from CryptoTrader.trading.indicators import add_indicators

BINANCE_REST = "https://api.binance.com/api/v3/klines"

def fetch_history(symbol='BTCUSDT', interval='1m', limit=1500):
    import requests
    params = {'symbol': symbol.upper(), 'interval': interval, 'limit': limit}
    resp = requests.get(BINANCE_REST, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    cols = ['open_time','open','high','low','close','volume','close_time','qav','trades','tb_base','tb_quote','ignore']
    df = pd.DataFrame(data, columns=cols)
    df.index = pd.to_datetime(df['open_time'], unit='ms')
    df = df[['open','high','low','close','volume']].astype(float)
    return df

def build_features(df):
    df = add_indicators(df)
    df['future_close'] = df['close'].shift(-1)
    df['target'] = (df['future_close'] > df['close']).astype(int)
    df = df.dropna()
    feature_cols = ['close','ema_short','ema_long','rsi','atr','ret_1','ret_3','vol_rolling','sma50']
    X = df[feature_cols].fillna(0)
    y = df['target'].astype(int)
    return X, y, df

def train_model_for_symbol(symbol, interval='1m', model_dir='models'):
    os.makedirs(model_dir, exist_ok=True)
    try:
        df = fetch_history(symbol, interval, limit=1500)
        X, y, df_full = build_features(df)
        if len(X) < 200:
            return None, 'not_enough_data'
        clf = RandomForestClassifier(n_estimators=200, n_jobs=-1, random_state=42)
        clf.fit(X, y)
        path = os.path.join(model_dir, f"model_{symbol.upper()}.pkl")
        joblib.dump(clf, path)
        return path, None
    except Exception as e:
        return None, str(e)

def train_in_background(symbol, interval='1m', model_dir='models', callback=None):
    def _job():
        path, err = train_model_for_symbol(symbol, interval, model_dir)
        if callback:
            callback(symbol, path, err)
    t = threading.Thread(target=_job, daemon=True)
    t.start()
    return t
