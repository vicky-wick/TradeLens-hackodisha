import os
import joblib
import pandas as pd
from CryptoTrader.ml.train_and_predict_auto import build_features

def load_model(symbol: str):
    path = os.path.join("models", f"model_{symbol.upper()}.pkl")
    if not os.path.exists(path):
        return None
    return joblib.load(path)

def predict(symbol: str, df: pd.DataFrame):
    model = load_model(symbol)
    if model is None:
        return {"error": f"No trained model found for {symbol}"}

    X, y, df_feats = build_features(df)
    if X.empty:
        return {"error": "Not enough data to build features"}

    pred = model.predict(X.tail(1))[0]
    proba = model.predict_proba(X.tail(1))[0][1] if hasattr(model, 'predict_proba') else None
    return {
        "symbol": symbol,
        "prediction": "Buy" if int(pred) == 1 else "Sell",
        "probability": float(proba) if proba is not None else None
    }
