import pandas as pd

def backtest(df, initial_balance=1000.0, fee=0.00075, slippage=0.0005):
    balance = float(initial_balance)
    position = 0.0
    trades = []
    equity = []
    prices = df['close']
    for idx, row in df.iterrows():
        price = float(row['close'])
        rec = row.get('Recommendation', 'Hold')
        equity.append(balance + position * price)
        if rec == "Buy" and position == 0:
            qty = (balance * (1 - fee)) / (price * (1 + slippage))
            position = qty
            balance = 0.0
            trades.append((idx, 'BUY', price, qty))
        elif rec == "Sell" and position > 0:
            proceeds = position * price * (1 - fee) * (1 - slippage)
            trades.append((idx, 'SELL', price, position))
            balance = proceeds
            position = 0.0
    final_value = balance + position * prices.iloc[-1]
    equity_series = pd.Series(equity, index=df.index)
    return float(final_value), trades, equity_series
