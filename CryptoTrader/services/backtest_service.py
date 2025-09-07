from CryptoTrader.trading.backtester import backtest
from CryptoTrader.trading.indicators import add_indicators
from CryptoTrader.trading.strategy import add_signals

def run_backtest(df):
    df_ind = add_indicators(df)
    df_sig = add_signals(df_ind)
    final_val, trades, equity = backtest(df_sig)
    return {
        "final_value": final_val,
        "trades": len(trades),
        "equity_curve": equity.tolist()
    }
