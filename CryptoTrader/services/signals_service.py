from CryptoTrader.trading.indicators import add_indicators
from CryptoTrader.trading.strategy import add_signals

def compute_signals(df):
    df_ind = add_indicators(df)
    df_sig = add_signals(df_ind)
    return df_sig.tail(50).to_dict(orient="records")
