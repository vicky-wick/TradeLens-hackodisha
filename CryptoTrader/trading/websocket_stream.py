import websocket, json, threading, time, requests
from collections import deque
import pandas as pd

BINANCE_REST_KLINES = "https://api.binance.com/api/v3/klines"

class KlineCollector:
    def __init__(self, symbol="BTCUSDT", interval="1m", maxlen=1200):
        self.symbol = symbol.lower()
        self.interval = interval
        self.url = f"wss://stream.binance.com:9443/ws/{self.symbol}@kline_{self.interval}"
        self._ws = None
        self._thread = None
        self.running = False
        self.candles = deque(maxlen=maxlen)
        self._lock = threading.Lock()

    def _seed_from_rest(self, limit=1000):
        try:
            params = {"symbol": self.symbol.upper(), "interval": self.interval, "limit": limit}
            resp = requests.get(BINANCE_REST_KLINES, params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            for row in data:
                t = int(row[0])//1000
                candle = {
                    "time": t,
                    "open": float(row[1]),
                    "high": float(row[2]),
                    "low": float(row[3]),
                    "close": float(row[4]),
                    "volume": float(row[5]),
                    "is_closed": True
                }
                with self._lock:
                    self.candles.append(candle)
        except Exception as e:
            print("REST seed failed:", e)

    def _on_message(self, ws, message):
        try:
            msg = json.loads(message)
            k = msg.get("k", {})
            if not k:
                return
            candle = {
                "time": int(k["t"])//1000,
                "open": float(k["o"]),
                "high": float(k["h"]),
                "low": float(k["l"]),
                "close": float(k["c"]),
                "volume": float(k["v"]),
                "is_closed": bool(k["x"])
            }
            with self._lock:
                if self.candles and self.candles[-1]["time"] == candle["time"]:
                    self.candles[-1] = candle
                else:
                    self.candles.append(candle)
        except Exception as e:
            print("on_message error:", e)

    def _on_error(self, ws, error):
        print("WebSocket error:", error)

    def _on_close(self, ws, close_status_code, close_msg):
        print("WebSocket closed:", close_status_code, close_msg)
        self.running = False

    def _on_open(self, ws):
        print("WebSocket opened for", self.symbol, self.interval)

    def _run(self):
        self._ws = websocket.WebSocketApp(self.url,
            on_open=self._on_open,
            on_message=self._on_message,
            on_error=self._on_error,
            on_close=self._on_close)
        self._ws.run_forever()

    def start(self):
        if self.running:
            return
        # seed using REST
        self._seed_from_rest(limit=self.candles.maxlen)
        self.running = True
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()
        time.sleep(0.1)

    def stop(self):
        if self._ws:
            try:
                self._ws.close()
            except:
                pass
        self.running = False

    def get_dataframe(self):
        import pandas as pd
        with self._lock:
            df = pd.DataFrame(list(self.candles))
        if df.empty:
            return pd.DataFrame()
        df = df.drop_duplicates(subset=['time']).sort_values('time')
        df['dt'] = pd.to_datetime(df['time'], unit='s')
        df.set_index('dt', inplace=True)
        df = df[['open','high','low','close','volume','is_closed']].astype({'open':float,'high':float,'low':float,'close':float,'volume':float,'is_closed':bool})
        return df
