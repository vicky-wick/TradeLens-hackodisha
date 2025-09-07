import pandas as pd
import numpy as np

def ema(series, span):
    return series.ewm(span=span, adjust=False).mean()

def sma(series, window):
    return series.rolling(window=window).mean()

def rsi(series, period=14):
    delta = series.diff()
    up = delta.clip(lower=0)
    down = -1 * delta.clip(upper=0)
    ma_up = up.rolling(window=period, min_periods=period).mean()
    ma_down = down.rolling(window=period, min_periods=period).mean()
    rs = ma_up / ma_down
    return 100 - (100 / (1 + rs))

def atr(df, period=14):
    tr1 = df['high'] - df['low']
    tr2 = (df['high'] - df['close'].shift()).abs()
    tr3 = (df['low'] - df['close'].shift()).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    return tr.rolling(period).mean()

def add_indicators(df, short=9, long=21, rsi_period=14):
    df = df.copy()
    df['close'] = df['close'].astype(float)
    df['ema_short'] = ema(df['close'], span=short)
    df['ema_long'] = ema(df['close'], span=long)
    df['sma50'] = sma(df['close'], window=50)
    df['rsi'] = rsi(df['close'], period=rsi_period)
    df['atr'] = atr(df, period=14)
    df['ret_1'] = df['close'].pct_change(1)
    df['ret_3'] = df['close'].pct_change(3)
    df['vol_rolling'] = df['volume'].rolling(20).mean()
    df = df.dropna()
    return df
