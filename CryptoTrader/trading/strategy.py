import numpy as np

def rule_signal_from_row(row):
    try:
        ema_short = row['ema_short']
        ema_long = row['ema_long']
        rsi = row['rsi']
    except Exception:
        return "Hold", 0.2, 0.5
    if np.isnan([ema_short, ema_long, rsi]).any():
        return "Hold", 0.2, 0.5
    if (ema_short > ema_long) and (rsi < 70):
        gap = abs(ema_short - ema_long) / row['close'] if row['close'] else 0
        conf = min(1.0, 0.25 + 3.0 * gap + (70 - rsi) / 200)
        risk = max(0.05, 0.5 - gap * 3)
        return "Buy", float(conf), float(risk)
    if (ema_short < ema_long) and (rsi > 30):
        gap = abs(ema_short - ema_long) / row['close'] if row['close'] else 0
        conf = min(1.0, 0.25 + 3.0 * gap + (rsi - 30) / 200)
        risk = max(0.05, 0.5 - gap * 3)
        return "Sell", float(conf), float(risk)
    return "Hold", 0.25, 0.5

def add_signals(df):
    df = df.copy()
    recs, confs, risks = [], [], []
    for _, r in df.iterrows():
        rec, c, risk = rule_signal_from_row(r)
        recs.append(rec); confs.append(c); risks.append(risk)
    df['Recommendation'] = recs
    df['Confidence'] = confs
    df['Risk'] = risks
    return df
