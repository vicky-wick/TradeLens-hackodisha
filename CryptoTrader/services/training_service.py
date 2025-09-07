from CryptoTrader.ml.train_and_predict_auto import train_in_background

def train_model(symbol: str, interval: str = "1m"):
    result = {"symbol": symbol, "status": "training_started"}
    try:
        train_in_background(symbol, interval=interval, callback=lambda s, p, e: None)
    except Exception as e:
        result["status"] = f"error: {e}"
    return result
