// TradeLens Binance API Integration
// Real-time cryptocurrency data via Binance WebSocket API

class BinanceAPI {
    constructor() {
        this.ws = null;
        this.chart = null;
        this.candlestickSeries = null;
        this.volumeSeries = null;
        this.currentSymbol = 'BTCUSDT';
        this.currentInterval = '1m';
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.candleData = [];
        this.lastPrice = 0;
        this.priceChangePercent = 0;
    }

    // Initialize the chart and WebSocket connection
    async init() {
        try {
            await this.initChart();
            await this.fetchInitialData();
            this.connectWebSocket();
            this.updateConnectionStatus('connecting');
        } catch (error) {
            console.error('Failed to initialize Binance API:', error);
            this.updateConnectionStatus('error');
        }
    }

    // Initialize TradingView Lightweight Charts
    initChart() {
        const chartContainer = document.getElementById('tradingViewChart');
        if (!chartContainer) {
            throw new Error('Chart container not found');
        }

        // Create chart with TradeLens theme
        this.chart = LightweightCharts.createChart(chartContainer, {
            width: chartContainer.clientWidth,
            height: 400,
            layout: {
                backgroundColor: '#ffffff',
                textColor: '#1e293b',
                fontSize: 12,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            grid: {
                vertLines: {
                    color: '#e2e8f0',
                    style: 1,
                },
                horzLines: {
                    color: '#e2e8f0',
                    style: 1,
                },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: '#e2e8f0',
                textColor: '#64748b',
            },
            timeScale: {
                borderColor: '#e2e8f0',
                textColor: '#64748b',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        // Add candlestick series
        this.candlestickSeries = this.chart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderDownColor: '#ef4444',
            borderUpColor: '#10b981',
            wickDownColor: '#ef4444',
            wickUpColor: '#10b981',
        });

        // Add volume series
        this.volumeSeries = this.chart.addHistogramSeries({
            color: '#6366f1',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        // Handle chart resize
        window.addEventListener('resize', () => {
            this.chart.applyOptions({
                width: chartContainer.clientWidth,
            });
        });

        return Promise.resolve();
    }

    // Fetch initial historical data from Binance REST API
    async fetchInitialData() {
        try {
            const response = await fetch(
                `https://api.binance.com/api/v3/klines?symbol=${this.currentSymbol}&interval=${this.currentInterval}&limit=100`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const klines = await response.json();
            
            // Convert Binance kline data to TradingView format
            const candleData = klines.map(kline => ({
                time: Math.floor(kline[0] / 1000), // Convert to seconds
                open: parseFloat(kline[1]),
                high: parseFloat(kline[2]),
                low: parseFloat(kline[3]),
                close: parseFloat(kline[4]),
            }));

            const volumeData = klines.map(kline => ({
                time: Math.floor(kline[0] / 1000),
                value: parseFloat(kline[5]),
                color: parseFloat(kline[4]) >= parseFloat(kline[1]) ? '#10b981' : '#ef4444'
            }));

            // Set data to chart
            this.candlestickSeries.setData(candleData);
            this.volumeSeries.setData(volumeData);
            
            this.candleData = candleData;
            
            // Update current price
            if (candleData.length > 0) {
                const lastCandle = candleData[candleData.length - 1];
                this.lastPrice = lastCandle.close;
                this.updatePriceDisplay(lastCandle.close);
            }

            // Fetch 24h ticker data
            await this.fetch24hTicker();
            
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
            throw error;
        }
    }

    // Fetch 24h ticker statistics
    async fetch24hTicker() {
        try {
            const response = await fetch(
                `https://api.binance.com/api/v3/ticker/24hr?symbol=${this.currentSymbol}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const ticker = await response.json();
            
            // Update 24h statistics
            this.update24hStats(ticker);
            
        } catch (error) {
            console.error('Failed to fetch 24h ticker:', error);
        }
    }

    // Connect to Binance WebSocket for real-time data
    connectWebSocket() {
        const wsUrl = `wss://stream.binance.com:9443/ws/${this.currentSymbol.toLowerCase()}@kline_${this.currentInterval}`;
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
            console.log('Binance WebSocket connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.updateConnectionStatus('connected');
            this.hideChartLoader();
        };
        
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleKlineData(data);
            } catch (error) {
                console.error('Error parsing WebSocket data:', error);
            }
        };
        
        this.ws.onclose = () => {
            console.log('Binance WebSocket disconnected');
            this.isConnected = false;
            this.updateConnectionStatus('disconnected');
            this.attemptReconnect();
        };
        
        this.ws.onerror = (error) => {
            console.error('Binance WebSocket error:', error);
            this.updateConnectionStatus('error');
        };
    }

    // Handle incoming kline data from WebSocket
    handleKlineData(data) {
        if (data.e !== 'kline') return;
        
        const kline = data.k;
        const candleData = {
            time: Math.floor(kline.t / 1000),
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
        };

        const volumeData = {
            time: Math.floor(kline.t / 1000),
            value: parseFloat(kline.v),
            color: parseFloat(kline.c) >= parseFloat(kline.o) ? '#10b981' : '#ef4444'
        };

        // Update chart with new data
        this.candlestickSeries.update(candleData);
        this.volumeSeries.update(volumeData);
        
        // Update price display
        this.updatePriceDisplay(parseFloat(kline.c));
        this.updateLastUpdateTime();
        
        // Calculate price change
        if (this.lastPrice > 0) {
            this.priceChangePercent = ((parseFloat(kline.c) - this.lastPrice) / this.lastPrice) * 100;
        }
        this.lastPrice = parseFloat(kline.c);
    }

    // Update price display in UI
    updatePriceDisplay(price) {
        const priceElement = document.getElementById('currentPriceValue');
        const changeElement = document.getElementById('priceChange');
        const headerPriceElement = document.getElementById('currentPrice');
        
        if (priceElement) {
            priceElement.textContent = `$${price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
        
        if (changeElement && this.priceChangePercent !== 0) {
            const isPositive = this.priceChangePercent > 0;
            changeElement.textContent = `${isPositive ? '+' : ''}${this.priceChangePercent.toFixed(2)}%`;
            changeElement.className = `indicator-change ${isPositive ? 'positive' : 'negative'}`;
        }
        
        // Update header price
        if (headerPriceElement) {
            const priceValue = headerPriceElement.querySelector('.price-value');
            const priceChange = headerPriceElement.querySelector('.price-change');
            
            if (priceValue) {
                priceValue.textContent = `$${price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            }
            
            if (priceChange && this.priceChangePercent !== 0) {
                const isPositive = this.priceChangePercent > 0;
                priceChange.textContent = `${isPositive ? '+' : ''}${this.priceChangePercent.toFixed(2)}%`;
                priceChange.className = `price-change ${isPositive ? 'positive' : 'negative'}`;
            }
        }
    }

    // Update 24h statistics
    update24hStats(ticker) {
        const volume24hElement = document.getElementById('volume24h');
        const high24hElement = document.getElementById('high24h');
        const low24hElement = document.getElementById('low24h');
        
        if (volume24hElement) {
            const volume = parseFloat(ticker.volume);
            volume24hElement.textContent = volume > 1000000 
                ? `${(volume / 1000000).toFixed(2)}M`
                : `${(volume / 1000).toFixed(2)}K`;
        }
        
        if (high24hElement) {
            high24hElement.textContent = `$${parseFloat(ticker.highPrice).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
        
        if (low24hElement) {
            low24hElement.textContent = `$${parseFloat(ticker.lowPrice).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
    }

    // Update connection status indicator
    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connectionStatus');
        if (!statusElement) return;
        
        const icon = statusElement.querySelector('i');
        const text = statusElement.querySelector('span');
        
        switch (status) {
            case 'connected':
                icon.className = 'fas fa-circle text-success';
                text.textContent = 'Live';
                break;
            case 'connecting':
                icon.className = 'fas fa-circle text-warning';
                text.textContent = 'Connecting...';
                break;
            case 'disconnected':
                icon.className = 'fas fa-circle text-secondary';
                text.textContent = 'Disconnected';
                break;
            case 'error':
                icon.className = 'fas fa-circle text-danger';
                text.textContent = 'Error';
                break;
        }
    }

    // Update last update time
    updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = 'Updated now';
        }
    }

    // Hide chart loader and show live chart
    hideChartLoader() {
        const loader = document.getElementById('chartLoader');
        const liveChart = document.getElementById('liveChart');
        
        if (loader) loader.style.display = 'none';
        if (liveChart) liveChart.style.display = 'block';
    }

    // Attempt to reconnect WebSocket
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connectWebSocket();
            }, 2000 * this.reconnectAttempts); // Exponential backoff
        } else {
            console.error('Max reconnection attempts reached');
            this.updateConnectionStatus('error');
        }
    }

    // Change symbol (e.g., BTC to ETH)
    changeSymbol(symbol) {
        if (this.ws) {
            this.ws.close();
        }
        
        this.currentSymbol = symbol + 'USDT';
        this.updateChartTitle();
        this.showChartLoader();
        this.fetchInitialData().then(() => {
            this.connectWebSocket();
        }).catch(error => {
            console.error('Failed to change symbol:', error);
            this.updateConnectionStatus('error');
        });
    }

    // Change timeframe
    changeTimeframe(interval) {
        if (this.ws) {
            this.ws.close();
        }
        
        this.currentInterval = interval;
        this.updateChartTitle();
        this.showChartLoader();
        this.fetchInitialData().then(() => {
            this.connectWebSocket();
        }).catch(error => {
            console.error('Failed to change timeframe:', error);
            this.updateConnectionStatus('error');
        });
    }

    // Show chart loader
    showChartLoader() {
        const loader = document.getElementById('chartLoader');
        const liveChart = document.getElementById('liveChart');
        
        if (loader) loader.style.display = 'flex';
        if (liveChart) liveChart.style.display = 'none';
    }

    // Update chart title
    updateChartTitle() {
        const titleElement = document.getElementById('chartTitle');
        if (titleElement) {
            titleElement.textContent = `${this.currentSymbol} - ${this.currentInterval}`;
        }
    }

    // Cleanup WebSocket connection
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
    }
}

// Global Binance API instance
let binanceAPI = null;

// Initialize Binance API when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the prediction page
    if (document.getElementById('tradingViewChart')) {
        binanceAPI = new BinanceAPI();
        
        // Make it globally accessible
        window.binanceAPI = binanceAPI;
        
        // Initialize after a short delay to ensure all elements are ready
        setTimeout(() => {
            binanceAPI.init().catch(error => {
                console.error('Failed to initialize Binance API:', error);
            });
        }, 500);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (binanceAPI) {
        binanceAPI.disconnect();
    }
});
