from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any
import pandas as pd

from CryptoTrader.services.prediction_service import predict
from CryptoTrader.services.training_service import train_model
from CryptoTrader.services.backtest_service import run_backtest
from CryptoTrader.services.signals_service import compute_signals


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend's domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the request model correctly
class PredictionRequest(BaseModel):
    symbol: str
    data: Dict[str, Any]

@app.get("/")
def root():
    return {"message": "Crypto Trader API is running"}

@app.post("/predict")
def get_prediction(request: PredictionRequest):
    df = pd.DataFrame(request.data)
    return predict(request.symbol, df)

@app.post("/train")
def train(symbol: str, interval: str = "1m"):
    return train_model(symbol, interval)

@app.post("/backtest")
def backtest(request: PredictionRequest):
    df = pd.DataFrame(request.data)
    return run_backtest(df)

@app.post("/signals")
def signals(request: PredictionRequest):
    df = pd.DataFrame(request.data)
    return compute_signals(df)