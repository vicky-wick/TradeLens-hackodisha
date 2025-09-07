// TradeLens Learning Hub JavaScript

// Loader utility functions
function showLoader(loaderId) {
    const loader = document.getElementById(loaderId);
    if (loader) {
        loader.classList.remove('hidden');
    }
}

function hideLoader(loaderId) {
    const loader = document.getElementById(loaderId);
    if (loader) {
        loader.classList.add('hidden');
    }
}

function showPageLoader() {
    showLoader('pageLoader');
}

function hidePageLoader() {
    hideLoader('pageLoader');
}

function showContentLoader() {
    showLoader('learningLoader');
    const content = document.getElementById('learningContent');
    if (content) {
        content.style.display = 'none';
    }
}

function hideContentLoader() {
    hideLoader('learningLoader');
    const content = document.getElementById('learningContent');
    if (content) {
        content.style.display = 'block';
    }
}

// Lesson data structure
const lessons = null;
let currentUser = null;
let currentLesson = null;
let currentCard = 0;
let lessonData = {};

// Initialize learning hub when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeLearning();
    setupModalEventListeners();
});

function initializeLearning() {
    // Show content loader while initializing
    showContentLoader();
    
    // Simulate loading time for realistic experience
    setTimeout(() => {
        // Check authentication
        currentUser = TradeLensStorage.getStoredUser();
        
        if (!currentUser) {
            window.location.href = '../index.html';
            return;
        }
        
        // Load user profile
        document.getElementById('userName').textContent = currentUser.displayName;
        
        // Initialize lesson data
        initializeLessonData();
        
        // Hide loader and show content
        hideContentLoader();
        
        // Check for lesson parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const lessonParam = urlParams.get('lesson');
        if (lessonParam) {
            openLesson(lessonParam);
        }
    }, 1200); // 1.2s loading simulation
}

function initializeLessonData() {
    lessonData = {
        'crypto-basics': {
            title: 'Crypto Fundamentals',
            cards: [
                {
                    type: 'content',
                    title: 'What is Cryptocurrency?',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Cryptocurrency</strong> is digital money secured by cryptography and powered by blockchain technology.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-shield-alt text-primary"></i>
                                    <span><strong>Decentralized</strong> - No central authority controls it</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-lock text-success"></i>
                                    <span><strong>Secure</strong> - Protected by advanced cryptography</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-globe text-info"></i>
                                    <span><strong>Global</strong> - Works 24/7 across borders</span>
                                </div>
                            </div>
                            <div class="info-box">
                                <p><strong>Key Insight:</strong> Unlike traditional money, crypto operates without banks or governments controlling it.</p>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Blockchain Basics',
                    content: `
                        <div class="lesson-card-content">
                            <p>Blockchain is like a digital ledger that everyone can see but no one can cheat:</p>
                            <div class="blockchain-visual">
                                <div class="block">
                                    <h5>Block 1</h5>
                                    <p>Alice → Bob: 5 BTC</p>
                                </div>
                                <div class="chain-link">⛓️</div>
                                <div class="block">
                                    <h5>Block 2</h5>
                                    <p>Bob → Charlie: 2 BTC</p>
                                </div>
                                <div class="chain-link">⛓️</div>
                                <div class="block">
                                    <h5>Block 3</h5>
                                    <p>Charlie → Dave: 1 BTC</p>
                                </div>
                            </div>
                            <div class="insight-box">
                                <i class="fas fa-lightbulb"></i>
                                <p>Each block is linked to the previous one, making it impossible to change past transactions!</p>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Getting Started with Crypto',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Your First Steps:</h4>
                            <div class="steps-grid">
                                <div class="step-item">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <h5>Learn the Basics</h5>
                                        <p>Understand Bitcoin, Ethereum, and major cryptocurrencies</p>
                                    </div>
                                </div>
                                <div class="step-item">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <h5>Choose an Exchange</h5>
                                        <p>Pick a reputable platform like Coinbase or Binance</p>
                                    </div>
                                </div>
                                <div class="step-item">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <h5>Start Small</h5>
                                        <p>Only invest what you can afford to lose</p>
                                    </div>
                                </div>
                            </div>
                            <div class="warning-box">
                                <i class="fas fa-exclamation-triangle"></i>
                                <p><strong>Remember:</strong> Crypto is volatile! Never invest more than you can afford to lose.</p>
                            </div>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What makes cryptocurrency different from traditional money?",
                options: [
                    { value: 'A', text: 'It\'s only digital' },
                    { value: 'B', text: 'It\'s decentralized and secured by cryptography' },
                    { value: 'C', text: 'It\'s more expensive' }
                ],
                correct: 'B',
                explanation: "Correct! Cryptocurrency is decentralized (no central authority) and secured by advanced cryptography, making it fundamentally different from traditional money."
            }
        },
        'rsi-basics': {
            title: 'RSI Basics',
            cards: [
                {
                    type: 'content',
                    title: 'What is RSI?',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>RSI (Relative Strength Index)</strong> measures recent price gains vs losses on a 0–100 scale.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-arrow-up text-success"></i>
                                    <span>Values <strong>>70</strong> often show <strong>overbought</strong> conditions</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-arrow-down text-danger"></i>
                                    <span>Values <strong><30</strong> often show <strong>oversold</strong> conditions</span>
                                </div>
                            </div>
                            <div class="formula-box">
                                <p><strong>RSI Formula:</strong> RSI = 100 - (100 / (1 + RS))</p>
                                <p><small>Where RS = Average Gain / Average Loss over 14 periods</small></p>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'RSI in Action',
                    content: `
                        <div class="lesson-card-content">
                            <p>See how RSI helps identify potential reversal points:</p>
                            <div class="chart-example">
                                <div class="price-chart">
                                    <div class="chart-title">BTC/USD Price Chart</div>
                                    <div class="price-line">
                                        <div class="price-point high" style="left: 20%">$45,000</div>
                                        <div class="price-point peak" style="left: 60%">$48,500</div>
                                        <div class="price-point low" style="left: 90%">$42,000</div>
                                    </div>
                                </div>
                                <div class="rsi-chart">
                                    <div class="chart-title">RSI Indicator</div>
                                    <div class="rsi-levels">
                                        <div class="rsi-line overbought">70 - Overbought</div>
                                        <div class="rsi-line oversold">30 - Oversold</div>
                                    </div>
                                    <div class="rsi-value" style="left: 60%">RSI: 82</div>
                                </div>
                            </div>
                            <div class="insight-box">
                                <i class="fas fa-lightbulb"></i>
                                <p>Notice how price fell after RSI peaked above 80, confirming the overbought signal!</p>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'How to Use RSI',
                    content: `
                        <div class="lesson-card-content">
                            <h4>RSI Trading Guidelines:</h4>
                            <div class="strategy-grid">
                                <div class="strategy-item">
                                    <div class="strategy-icon overbought">
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div class="strategy-content">
                                        <h5>When RSI > 70</h5>
                                        <p>Consider a tighter stop-loss as price may reverse downward</p>
                                    </div>
                                </div>
                                <div class="strategy-item">
                                    <div class="strategy-icon oversold">
                                        <i class="fas fa-chart-line"></i>
                                    </div>
                                    <div class="strategy-content">
                                        <h5>When RSI < 30</h5>
                                        <p>Look for potential reversal with volume support</p>
                                    </div>
                                </div>
                                <div class="strategy-item">
                                    <div class="strategy-icon neutral">
                                        <i class="fas fa-balance-scale"></i>
                                    </div>
                                    <div class="strategy-content">
                                        <h5>RSI 30-70</h5>
                                        <p>Neutral zone - combine with other indicators</p>
                                    </div>
                                </div>
                            </div>
                            <div class="warning-box">
                                <i class="fas fa-shield-alt"></i>
                                <p><strong>Remember:</strong> RSI works best when combined with volume analysis and trend confirmation!</p>
                            </div>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "If RSI = 78 and volume is falling, what's the likeliest short-term move?",
                options: [
                    { value: 'A', text: 'Continue rising strongly' },
                    { value: 'B', text: 'Short-term reversal more likely' },
                    { value: 'C', text: 'No clear indication' }
                ],
                correct: 'B',
                explanation: "Correct! RSI at 78 indicates overbought conditions, and falling volume suggests weakening momentum, making a short-term reversal more likely."
            }
        },
        'volume-analysis': {
            title: 'Volume Analysis',
            cards: [
                {
                    type: 'content',
                    title: 'Understanding Volume',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Volume</strong> represents the number of shares or contracts traded during a specific period.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-trending-up"></i>
                                    <span><strong>High Volume + Price Rise</strong> = Strong bullish momentum</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-trending-down"></i>
                                    <span><strong>High Volume + Price Fall</strong> = Strong bearish momentum</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-question-circle"></i>
                                    <span><strong>Low Volume</strong> = Weak conviction, potential reversal</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Volume Patterns',
                    content: `
                        <div class="lesson-card-content">
                            <p>Volume confirms or contradicts price movements:</p>
                            <div class="volume-examples">
                                <div class="volume-example">
                                    <h5>✅ Healthy Uptrend</h5>
                                    <p>Price ↗️ + Volume ↗️</p>
                                </div>
                                <div class="volume-example warning">
                                    <h5>⚠️ Weak Uptrend</h5>
                                    <p>Price ↗️ + Volume ↘️</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Volume Trading Tips',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Key Volume Strategies:</h4>
                            <ul>
                                <li>Look for volume spikes during breakouts</li>
                                <li>Declining volume may signal trend exhaustion</li>
                                <li>Volume should confirm your RSI analysis</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What does declining volume during a price rise typically indicate?",
                options: [
                    { value: 'A', text: 'Strong bullish momentum' },
                    { value: 'B', text: 'Weakening trend, potential reversal' },
                    { value: 'C', text: 'Normal market behavior' }
                ],
                correct: 'B',
                explanation: "Correct! Declining volume during a price rise suggests weakening conviction and potential trend reversal."
            }
        },
        'moving-averages': {
            title: 'Moving Averages',
            cards: [
                {
                    type: 'content',
                    title: 'Understanding Moving Averages',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Moving Averages</strong> smooth out price data to identify trend direction over time.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-chart-line text-primary"></i>
                                    <span><strong>SMA (Simple)</strong> - Average of closing prices over N periods</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-trending-up text-success"></i>
                                    <span><strong>EMA (Exponential)</strong> - Gives more weight to recent prices</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-clock text-info"></i>
                                    <span><strong>Common periods:</strong> 20, 50, 100, 200 days</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'MA Crossover Signals',
                    content: `
                        <div class="lesson-card-content">
                            <p>Moving average crossovers generate buy/sell signals:</p>
                            <div class="crossover-example">
                                <div class="signal bullish">
                                    <h5>🟢 Golden Cross (Bullish)</h5>
                                    <p>Short MA crosses above Long MA</p>
                                </div>
                                <div class="signal bearish">
                                    <h5>🔴 Death Cross (Bearish)</h5>
                                    <p>Short MA crosses below Long MA</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'MA Trading Strategy',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Simple MA Strategy:</h4>
                            <ul>
                                <li>Price above 50 MA = Uptrend</li>
                                <li>Price below 50 MA = Downtrend</li>
                                <li>Use 20/50 crossover for entry signals</li>
                                <li>Combine with volume for confirmation</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What does a 'Golden Cross' signal indicate?",
                options: [
                    { value: 'A', text: 'Bearish trend reversal' },
                    { value: 'B', text: 'Bullish trend reversal' },
                    { value: 'C', text: 'Sideways movement' }
                ],
                correct: 'B',
                explanation: "Correct! A Golden Cross occurs when a short-term MA crosses above a long-term MA, signaling potential bullish momentum."
            }
        },
        'support-resistance': {
            title: 'Support & Resistance',
            cards: [
                {
                    type: 'content',
                    title: 'Key Price Levels',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Support and Resistance</strong> are key price levels where buying or selling pressure emerges.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-arrow-up text-success"></i>
                                    <span><strong>Support</strong> - Price level where buying interest emerges</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-arrow-down text-danger"></i>
                                    <span><strong>Resistance</strong> - Price level where selling pressure appears</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-sync text-info"></i>
                                    <span><strong>Role Reversal</strong> - Support becomes resistance and vice versa</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Identifying Levels',
                    content: `
                        <div class="lesson-card-content">
                            <p>Look for areas where price has bounced multiple times:</p>
                            <div class="levels-example">
                                <div class="price-action">
                                    <div class="resistance-line">$50,000 Resistance</div>
                                    <div class="price-bounces">📈📉📈📉</div>
                                    <div class="support-line">$45,000 Support</div>
                                </div>
                            </div>
                            <div class="insight-box">
                                <i class="fas fa-lightbulb"></i>
                                <p>The more times price bounces off a level, the stronger it becomes!</p>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Trading S&R Levels',
                    content: `
                        <div class="lesson-card-content">
                            <h4>S&R Trading Rules:</h4>
                            <div class="strategy-grid">
                                <div class="strategy-item">
                                    <h5>🎯 Buy at Support</h5>
                                    <p>Look for bounce confirmation with volume</p>
                                </div>
                                <div class="strategy-item">
                                    <h5>🎯 Sell at Resistance</h5>
                                    <p>Watch for rejection signals and reversal patterns</p>
                                </div>
                                <div class="strategy-item">
                                    <h5>🚀 Breakout Trading</h5>
                                    <p>Trade the break above resistance or below support</p>
                                </div>
                            </div>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What happens when a support level is broken?",
                options: [
                    { value: 'A', text: 'It becomes resistance' },
                    { value: 'B', text: 'It becomes stronger support' },
                    { value: 'C', text: 'Nothing changes' }
                ],
                correct: 'A',
                explanation: "Correct! When support is broken, it often becomes resistance due to role reversal - traders who bought at that level may sell when price returns."
            }
        },
        'candlestick-patterns': {
            title: 'Candlestick Patterns',
            cards: [
                {
                    type: 'content',
                    title: 'Reading Candlesticks',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Candlesticks</strong> show open, high, low, and close prices in a visual format.</p>
                            <div class="candlestick-anatomy">
                                <div class="candle-parts">
                                    <div class="wick-high">Upper Wick (High)</div>
                                    <div class="body bullish">Body (Open to Close)</div>
                                    <div class="wick-low">Lower Wick (Low)</div>
                                </div>
                            </div>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-square text-success"></i>
                                    <span><strong>Green/White</strong> - Close > Open (Bullish)</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-square text-danger"></i>
                                    <span><strong>Red/Black</strong> - Close < Open (Bearish)</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Key Patterns',
                    content: `
                        <div class="lesson-card-content">
                            <p>Important reversal patterns to know:</p>
                            <div class="patterns-grid">
                                <div class="pattern">
                                    <h5>🔨 Hammer</h5>
                                    <p>Bullish reversal at support</p>
                                </div>
                                <div class="pattern">
                                    <h5>💫 Doji</h5>
                                    <p>Indecision, potential reversal</p>
                                </div>
                                <div class="pattern">
                                    <h5>🌟 Shooting Star</h5>
                                    <p>Bearish reversal at resistance</p>
                                </div>
                                <div class="pattern">
                                    <h5>🎯 Engulfing</h5>
                                    <p>Strong reversal signal</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Pattern Trading',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Trading Candlestick Patterns:</h4>
                            <div class="trading-rules">
                                <div class="rule">
                                    <h5>1. Context Matters</h5>
                                    <p>Patterns work best at key S&R levels</p>
                                </div>
                                <div class="rule">
                                    <h5>2. Confirm with Volume</h5>
                                    <p>Higher volume increases pattern reliability</p>
                                </div>
                                <div class="rule">
                                    <h5>3. Wait for Confirmation</h5>
                                    <p>Don't trade on the pattern candle alone</p>
                                </div>
                            </div>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "A Hammer candlestick pattern is most reliable when it appears:",
                options: [
                    { value: 'A', text: 'At resistance levels' },
                    { value: 'B', text: 'At support levels after a downtrend' },
                    { value: 'C', text: 'In the middle of a trend' }
                ],
                correct: 'B',
                explanation: "Correct! Hammer patterns are bullish reversal signals that work best when they appear at support levels after a downtrend, indicating potential buying interest."
            }
        },
        'market-orders': {
            title: 'Market Orders',
            cards: [
                {
                    type: 'content',
                    title: 'Types of Orders',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Market Orders</strong> are instructions to buy or sell immediately at the current market price.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-bolt text-warning"></i>
                                    <span><strong>Market Order</strong> - Execute immediately at best available price</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-target text-primary"></i>
                                    <span><strong>Limit Order</strong> - Execute only at specified price or better</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-shield-alt text-success"></i>
                                    <span><strong>Stop Order</strong> - Trigger when price reaches stop level</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Order Execution',
                    content: `
                        <div class="lesson-card-content">
                            <p>Understanding how different orders work:</p>
                            <div class="order-examples">
                                <div class="order-type">
                                    <h5>⚡ Market Buy</h5>
                                    <p>BTC = $45,000 → Buy immediately</p>
                                </div>
                                <div class="order-type">
                                    <h5>🎯 Limit Buy</h5>
                                    <p>Set: $44,000 → Wait for price drop</p>
                                </div>
                                <div class="order-type">
                                    <h5>🛡️ Stop Loss</h5>
                                    <p>Set: $43,000 → Sell if price falls</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Order Strategy',
                    content: `
                        <div class="lesson-card-content">
                            <h4>When to Use Each Order:</h4>
                            <div class="strategy-grid">
                                <div class="strategy-item">
                                    <h5>Market Orders</h5>
                                    <p>• Fast execution needed<br>• High liquidity markets<br>• Small position sizes</p>
                                </div>
                                <div class="strategy-item">
                                    <h5>Limit Orders</h5>
                                    <p>• Better price control<br>• Large positions<br>• Patient trading</p>
                                </div>
                                <div class="strategy-item">
                                    <h5>Stop Orders</h5>
                                    <p>• Risk management<br>• Breakout trading<br>• Automated exits</p>
                                </div>
                            </div>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "When is a limit order most useful?",
                options: [
                    { value: 'A', text: 'When you need immediate execution' },
                    { value: 'B', text: 'When you want better price control' },
                    { value: 'C', text: 'When setting stop losses' }
                ],
                correct: 'B',
                explanation: "Correct! Limit orders give you better price control by only executing at your specified price or better, though execution isn't guaranteed."
            }
        },
        'macd-signals': {
            title: 'MACD Signals',
            cards: [
                {
                    type: 'content',
                    title: 'Understanding MACD',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>MACD</strong> (Moving Average Convergence Divergence) shows the relationship between two moving averages.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-chart-line text-primary"></i>
                                    <span><strong>MACD Line</strong> - 12 EMA minus 26 EMA</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-minus text-secondary"></i>
                                    <span><strong>Signal Line</strong> - 9 EMA of MACD line</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-chart-bar text-info"></i>
                                    <span><strong>Histogram</strong> - MACD minus Signal line</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'MACD Crossovers',
                    content: `
                        <div class="lesson-card-content">
                            <p>Key MACD signals to watch for:</p>
                            <div class="macd-signals">
                                <div class="signal bullish">
                                    <h5>🟢 Bullish Crossover</h5>
                                    <p>MACD crosses above Signal line</p>
                                </div>
                                <div class="signal bearish">
                                    <h5>🔴 Bearish Crossover</h5>
                                    <p>MACD crosses below Signal line</p>
                                </div>
                                <div class="signal divergence">
                                    <h5>⚠️ Divergence</h5>
                                    <p>Price and MACD move in opposite directions</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'MACD Trading',
                    content: `
                        <div class="lesson-card-content">
                            <h4>MACD Trading Rules:</h4>
                            <ul>
                                <li>Buy when MACD crosses above signal line</li>
                                <li>Sell when MACD crosses below signal line</li>
                                <li>Watch for divergences at key levels</li>
                                <li>Confirm with price action and volume</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What does a bullish MACD crossover indicate?",
                options: [
                    { value: 'A', text: 'MACD crosses below signal line' },
                    { value: 'B', text: 'MACD crosses above signal line' },
                    { value: 'C', text: 'Histogram turns negative' }
                ],
                correct: 'B',
                explanation: "Correct! A bullish MACD crossover occurs when the MACD line crosses above the signal line, suggesting upward momentum."
            }
        },
        'bollinger-bands': {
            title: 'Bollinger Bands',
            cards: [
                {
                    type: 'content',
                    title: 'Band Components',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Bollinger Bands</strong> consist of a moving average with upper and lower bands based on standard deviation.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-minus text-primary"></i>
                                    <span><strong>Middle Band</strong> - 20-period Simple Moving Average</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-arrow-up text-success"></i>
                                    <span><strong>Upper Band</strong> - Middle Band + (2 × Standard Deviation)</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-arrow-down text-danger"></i>
                                    <span><strong>Lower Band</strong> - Middle Band - (2 × Standard Deviation)</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Band Behavior',
                    content: `
                        <div class="lesson-card-content">
                            <p>How bands react to market conditions:</p>
                            <div class="band-conditions">
                                <div class="condition">
                                    <h5>📈 High Volatility</h5>
                                    <p>Bands expand wider</p>
                                </div>
                                <div class="condition">
                                    <h5>📊 Low Volatility</h5>
                                    <p>Bands contract (squeeze)</p>
                                </div>
                                <div class="condition">
                                    <h5>🎯 Price Touches Bands</h5>
                                    <p>Potential reversal signal</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Bollinger Band Trading',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Trading Strategies:</h4>
                            <div class="strategy-list">
                                <div class="strategy">
                                    <h5>Band Bounce</h5>
                                    <p>Buy at lower band, sell at upper band in ranging markets</p>
                                </div>
                                <div class="strategy">
                                    <h5>Band Squeeze</h5>
                                    <p>Prepare for breakout when bands contract</p>
                                </div>
                                <div class="strategy">
                                    <h5>Band Walk</h5>
                                    <p>Strong trends can "walk" along one band</p>
                                </div>
                            </div>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What does a Bollinger Band squeeze typically indicate?",
                options: [
                    { value: 'A', text: 'High volatility period' },
                    { value: 'B', text: 'Low volatility, potential breakout coming' },
                    { value: 'C', text: 'Strong trending market' }
                ],
                correct: 'B',
                explanation: "Correct! A Bollinger Band squeeze (bands contracting) indicates low volatility and often precedes a significant price breakout."
            }
        },
        'fibonacci-retracements': {
            title: 'Fibonacci Retracements',
            cards: [
                {
                    type: 'content',
                    title: 'Fibonacci Levels',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Fibonacci Retracements</strong> use mathematical ratios to identify potential support and resistance levels.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-percentage text-primary"></i>
                                    <span><strong>Key Levels:</strong> 23.6%, 38.2%, 50%, 61.8%, 78.6%</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-chart-area text-success"></i>
                                    <span><strong>Golden Ratio:</strong> 61.8% is the most significant level</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-arrows-alt-v text-info"></i>
                                    <span><strong>Usage:</strong> Draw from swing high to swing low</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Fib Application',
                    content: `
                        <div class="lesson-card-content">
                            <p>How to apply Fibonacci retracements:</p>
                            <div class="fib-example">
                                <div class="price-move">
                                    <h5>📈 Uptrend Retracement</h5>
                                    <p>High: $50,000 → Low: $40,000</p>
                                    <div class="fib-levels">
                                        <div class="level">61.8%: $46,180</div>
                                        <div class="level">50.0%: $45,000</div>
                                        <div class="level">38.2%: $43,820</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Fibonacci Trading',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Trading with Fibonacci:</h4>
                            <ul>
                                <li>Look for bounces at key Fib levels</li>
                                <li>61.8% level often provides strong support/resistance</li>
                                <li>Combine with other indicators for confirmation</li>
                                <li>Use for entry points and profit targets</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "Which Fibonacci level is considered the most significant?",
                options: [
                    { value: 'A', text: '50%' },
                    { value: 'B', text: '61.8%' },
                    { value: 'C', text: '38.2%' }
                ],
                correct: 'B',
                explanation: "Correct! The 61.8% level (golden ratio) is considered the most significant Fibonacci retracement level for support and resistance."
            }
        },
        'trend-analysis': {
            title: 'Trend Analysis',
            cards: [
                {
                    type: 'content',
                    title: 'Identifying Trends',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Trend Analysis</strong> helps identify the overall direction of price movement.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-arrow-up text-success"></i>
                                    <span><strong>Uptrend:</strong> Higher highs and higher lows</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-arrow-down text-danger"></i>
                                    <span><strong>Downtrend:</strong> Lower highs and lower lows</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-arrows-alt-h text-warning"></i>
                                    <span><strong>Sideways:</strong> Horizontal price movement</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Trend Lines',
                    content: `
                        <div class="lesson-card-content">
                            <p>Drawing and using trend lines:</p>
                            <div class="trend-examples">
                                <div class="trend-type">
                                    <h5>📈 Uptrend Line</h5>
                                    <p>Connect swing lows - acts as support</p>
                                </div>
                                <div class="trend-type">
                                    <h5>📉 Downtrend Line</h5>
                                    <p>Connect swing highs - acts as resistance</p>
                                </div>
                                <div class="trend-type">
                                    <h5>🔄 Channel Lines</h5>
                                    <p>Parallel lines containing price action</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Trend Trading',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Trading with Trends:</h4>
                            <div class="trend-rules">
                                <div class="rule">
                                    <h5>"The Trend is Your Friend"</h5>
                                    <p>Trade in the direction of the main trend</p>
                                </div>
                                <div class="rule">
                                    <h5>Trend Breaks</h5>
                                    <p>Watch for trend line breaks as reversal signals</p>
                                </div>
                                <div class="rule">
                                    <h5>Multiple Timeframes</h5>
                                    <p>Check trends on different time horizons</p>
                                </div>
                            </div>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What characterizes a healthy uptrend?",
                options: [
                    { value: 'A', text: 'Lower highs and lower lows' },
                    { value: 'B', text: 'Higher highs and higher lows' },
                    { value: 'C', text: 'Horizontal price movement' }
                ],
                correct: 'B',
                explanation: "Correct! A healthy uptrend is characterized by a series of higher highs and higher lows, showing consistent upward momentum."
            }
        },
        'risk-management': {
            title: 'Risk Management',
            cards: [
                {
                    type: 'content',
                    title: 'Risk Fundamentals',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Risk Management</strong> is the most important aspect of successful trading.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-percentage text-danger"></i>
                                    <span><strong>2% Rule:</strong> Never risk more than 2% per trade</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-shield-alt text-success"></i>
                                    <span><strong>Stop Loss:</strong> Always have an exit plan</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-balance-scale text-primary"></i>
                                    <span><strong>Risk/Reward:</strong> Aim for 1:2 or better ratios</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Position Sizing',
                    content: `
                        <div class="lesson-card-content">
                            <p>Calculate proper position size:</p>
                            <div class="position-calc">
                                <div class="calc-example">
                                    <h5>Example Calculation:</h5>
                                    <p>Account: $10,000</p>
                                    <p>Risk per trade: 2% = $200</p>
                                    <p>Stop loss: $100 (5% from entry)</p>
                                    <p>Position size: $200 ÷ 0.05 = $4,000</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Risk Rules',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Essential Risk Rules:</h4>
                            <ul>
                                <li>Never risk more than you can afford to lose</li>
                                <li>Use stop losses on every trade</li>
                                <li>Diversify across different assets</li>
                                <li>Keep a trading journal</li>
                                <li>Don't revenge trade after losses</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What is the recommended maximum risk per trade?",
                options: [
                    { value: 'A', text: '5% of account' },
                    { value: 'B', text: '2% of account' },
                    { value: 'C', text: '10% of account' }
                ],
                correct: 'B',
                explanation: "Correct! The 2% rule suggests never risking more than 2% of your account on a single trade to preserve capital long-term."
            }
        },
        'portfolio-theory': {
            title: 'Portfolio Theory',
            cards: [
                {
                    type: 'content',
                    title: 'Diversification Basics',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Portfolio Theory</strong> focuses on optimizing risk and return through diversification.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-chart-pie text-primary"></i>
                                    <span><strong>Diversification:</strong> Don't put all eggs in one basket</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-link text-warning"></i>
                                    <span><strong>Correlation:</strong> How assets move together</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-balance-scale text-success"></i>
                                    <span><strong>Risk/Return:</strong> Balance between safety and profit</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Asset Allocation',
                    content: `
                        <div class="lesson-card-content">
                            <p>Sample crypto portfolio allocation:</p>
                            <div class="portfolio-example">
                                <div class="allocation">
                                    <h5>🟡 Bitcoin (BTC): 40%</h5>
                                    <p>Store of value, lowest volatility</p>
                                </div>
                                <div class="allocation">
                                    <h5>🔷 Ethereum (ETH): 30%</h5>
                                    <p>Smart contracts, DeFi ecosystem</p>
                                </div>
                                <div class="allocation">
                                    <h5>🎯 Altcoins: 20%</h5>
                                    <p>Higher risk/reward potential</p>
                                </div>
                                <div class="allocation">
                                    <h5>💰 Stablecoins: 10%</h5>
                                    <p>Liquidity and stability</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Portfolio Management',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Portfolio Best Practices:</h4>
                            <ul>
                                <li>Rebalance regularly (monthly/quarterly)</li>
                                <li>Consider correlation between assets</li>
                                <li>Don't over-diversify (5-10 positions max)</li>
                                <li>Adjust allocation based on market conditions</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What is the main benefit of portfolio diversification?",
                options: [
                    { value: 'A', text: 'Higher returns' },
                    { value: 'B', text: 'Reduced overall risk' },
                    { value: 'C', text: 'Lower fees' }
                ],
                correct: 'B',
                explanation: "Correct! Diversification's main benefit is reducing overall portfolio risk by spreading investments across different assets."
            }
        },
        'market-psychology': {
            title: 'Market Psychology',
            cards: [
                {
                    type: 'content',
                    title: 'Emotions in Trading',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Market Psychology</strong> studies how emotions and cognitive biases affect trading decisions.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-heart text-danger"></i>
                                    <span><strong>Fear:</strong> Causes panic selling and missed opportunities</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-dollar-sign text-success"></i>
                                    <span><strong>Greed:</strong> Leads to overtrading and excessive risk</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-brain text-primary"></i>
                                    <span><strong>FOMO:</strong> Fear of missing out drives bad decisions</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Market Cycles',
                    content: `
                        <div class="lesson-card-content">
                            <p>Emotional cycle of market participants:</p>
                            <div class="emotion-cycle">
                                <div class="cycle-stage">
                                    <h5>😊 Optimism</h5>
                                    <p>Prices rising, confidence building</p>
                                </div>
                                <div class="cycle-stage">
                                    <h5>🤑 Euphoria</h5>
                                    <p>Peak excitement, maximum risk</p>
                                </div>
                                <div class="cycle-stage">
                                    <h5>😰 Panic</h5>
                                    <p>Prices falling, fear dominates</p>
                                </div>
                                <div class="cycle-stage">
                                    <h5>😔 Despair</h5>
                                    <p>Bottom reached, opportunity emerges</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Psychological Discipline',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Managing Trading Psychology:</h4>
                            <ul>
                                <li>Stick to your trading plan</li>
                                <li>Use position sizing to control emotions</li>
                                <li>Take breaks after big wins/losses</li>
                                <li>Keep a trading journal</li>
                                <li>Practice meditation and mindfulness</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "When do most traders make their worst decisions?",
                options: [
                    { value: 'A', text: 'During calm markets' },
                    { value: 'B', text: 'At emotional extremes (fear/greed)' },
                    { value: 'C', text: 'During lunch breaks' }
                ],
                correct: 'B',
                explanation: "Correct! Traders typically make their worst decisions when emotions are at extremes - either in panic (fear) or euphoria (greed)."
            }
        },
        'options-trading': {
            title: 'Options Trading',
            cards: [
                {
                    type: 'content',
                    title: 'Options Basics',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Options</strong> give you the right (not obligation) to buy or sell an asset at a specific price.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-arrow-up text-success"></i>
                                    <span><strong>Call Options:</strong> Right to buy at strike price</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-arrow-down text-danger"></i>
                                    <span><strong>Put Options:</strong> Right to sell at strike price</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-calendar text-warning"></i>
                                    <span><strong>Expiration:</strong> Options have time limits</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Options Strategies',
                    content: `
                        <div class="lesson-card-content">
                            <p>Basic options strategies:</p>
                            <div class="options-strategies">
                                <div class="strategy">
                                    <h5>📈 Long Call</h5>
                                    <p>Bullish strategy, limited risk</p>
                                </div>
                                <div class="strategy">
                                    <h5>📉 Long Put</h5>
                                    <p>Bearish strategy, portfolio protection</p>
                                </div>
                                <div class="strategy">
                                    <h5>🎯 Covered Call</h5>
                                    <p>Income generation on holdings</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Options Greeks',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Understanding the Greeks:</h4>
                            <ul>
                                <li><strong>Delta:</strong> Price sensitivity to underlying</li>
                                <li><strong>Gamma:</strong> Rate of change of delta</li>
                                <li><strong>Theta:</strong> Time decay effect</li>
                                <li><strong>Vega:</strong> Volatility sensitivity</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What does a call option give you the right to do?",
                options: [
                    { value: 'A', text: 'Sell at strike price' },
                    { value: 'B', text: 'Buy at strike price' },
                    { value: 'C', text: 'Cancel the contract' }
                ],
                correct: 'B',
                explanation: "Correct! A call option gives you the right (not obligation) to buy the underlying asset at the strike price before expiration."
            }
        },
        'defi-strategies': {
            title: 'DeFi Strategies',
            cards: [
                {
                    type: 'content',
                    title: 'DeFi Fundamentals',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>DeFi</strong> (Decentralized Finance) recreates traditional financial services on blockchain.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-swimming-pool text-primary"></i>
                                    <span><strong>Liquidity Pools:</strong> Provide liquidity, earn fees</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-seedling text-success"></i>
                                    <span><strong>Yield Farming:</strong> Earn rewards by staking tokens</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-coins text-warning"></i>
                                    <span><strong>Governance Tokens:</strong> Vote on protocol changes</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'DeFi Protocols',
                    content: `
                        <div class="lesson-card-content">
                            <p>Major DeFi categories:</p>
                            <div class="defi-protocols">
                                <div class="protocol">
                                    <h5>🔄 DEXs</h5>
                                    <p>Uniswap, SushiSwap - Token swapping</p>
                                </div>
                                <div class="protocol">
                                    <h5>🏦 Lending</h5>
                                    <p>Aave, Compound - Borrow/Lend crypto</p>
                                </div>
                                <div class="protocol">
                                    <h5>📊 Derivatives</h5>
                                    <p>dYdX, Synthetix - Synthetic assets</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'DeFi Risks',
                    content: `
                        <div class="lesson-card-content">
                            <h4>DeFi Risk Management:</h4>
                            <ul>
                                <li><strong>Smart Contract Risk:</strong> Code vulnerabilities</li>
                                <li><strong>Impermanent Loss:</strong> LP token value changes</li>
                                <li><strong>Rug Pulls:</strong> Malicious project exits</li>
                                <li><strong>High Gas Fees:</strong> Ethereum network costs</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What is impermanent loss in DeFi?",
                options: [
                    { value: 'A', text: 'Temporary network downtime' },
                    { value: 'B', text: 'Loss from providing liquidity vs holding tokens' },
                    { value: 'C', text: 'Smart contract bugs' }
                ],
                correct: 'B',
                explanation: "Correct! Impermanent loss occurs when the value of tokens in a liquidity pool changes compared to just holding them."
            }
        },
        'arbitrage-trading': {
            title: 'Arbitrage Trading',
            cards: [
                {
                    type: 'content',
                    title: 'Arbitrage Basics',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Arbitrage</strong> exploits price differences of the same asset across different markets.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-exchange-alt text-primary"></i>
                                    <span><strong>Cross-Exchange:</strong> Price differences between exchanges</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-clock text-warning"></i>
                                    <span><strong>Speed:</strong> Opportunities disappear quickly</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-robot text-success"></i>
                                    <span><strong>Automation:</strong> Bots execute faster than humans</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Arbitrage Example',
                    content: `
                        <div class="lesson-card-content">
                            <p>Simple arbitrage opportunity:</p>
                            <div class="arbitrage-example">
                                <div class="exchange">
                                    <h5>Exchange A</h5>
                                    <p>BTC: $45,000</p>
                                </div>
                                <div class="arrow">→</div>
                                <div class="exchange">
                                    <h5>Exchange B</h5>
                                    <p>BTC: $45,200</p>
                                </div>
                                <div class="profit">
                                    <h5>💰 Profit: $200</h5>
                                    <p>Buy on A, sell on B</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Arbitrage Challenges',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Arbitrage Considerations:</h4>
                            <ul>
                                <li>Transaction fees reduce profits</li>
                                <li>Transfer times between exchanges</li>
                                <li>Slippage on large orders</li>
                                <li>Regulatory restrictions</li>
                                <li>Capital requirements for both exchanges</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What is the main challenge with arbitrage trading?",
                options: [
                    { value: 'A', text: 'High risk of losses' },
                    { value: 'B', text: 'Opportunities disappear quickly' },
                    { value: 'C', text: 'Requires advanced analysis' }
                ],
                correct: 'B',
                explanation: "Correct! Arbitrage opportunities are quickly eliminated by other traders and bots, making speed crucial for success."
            }
        },
        'algorithmic-trading': {
            title: 'Algorithmic Trading',
            cards: [
                {
                    type: 'content',
                    title: 'Algo Trading Basics',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Algorithmic Trading</strong> uses computer programs to execute trades based on predefined rules.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-code text-primary"></i>
                                    <span><strong>Automation:</strong> Remove emotions from trading</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-tachometer-alt text-success"></i>
                                    <span><strong>Speed:</strong> Execute trades in milliseconds</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-chart-bar text-info"></i>
                                    <span><strong>Backtesting:</strong> Test strategies on historical data</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Trading Strategies',
                    content: `
                        <div class="lesson-card-content">
                            <p>Common algorithmic strategies:</p>
                            <div class="algo-strategies">
                                <div class="strategy">
                                    <h5>📈 Trend Following</h5>
                                    <p>Follow moving average crossovers</p>
                                </div>
                                <div class="strategy">
                                    <h5>🔄 Mean Reversion</h5>
                                    <p>Trade when price deviates from average</p>
                                </div>
                                <div class="strategy">
                                    <h5>⚡ Market Making</h5>
                                    <p>Provide liquidity, profit from spreads</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Building Algorithms',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Algorithm Development Process:</h4>
                            <ul>
                                <li>Define clear entry/exit rules</li>
                                <li>Backtest on historical data</li>
                                <li>Implement risk management</li>
                                <li>Paper trade before going live</li>
                                <li>Monitor and adjust performance</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What is the main advantage of algorithmic trading?",
                options: [
                    { value: 'A', text: 'Guaranteed profits' },
                    { value: 'B', text: 'Removes emotions and executes consistently' },
                    { value: 'C', text: 'Requires no market knowledge' }
                ],
                correct: 'B',
                explanation: "Correct! Algorithmic trading's main advantage is removing emotional decision-making and executing trades consistently based on predefined rules."
            }
        },
        'derivatives-trading': {
            title: 'Derivatives Trading',
            cards: [
                {
                    type: 'content',
                    title: 'Derivatives Overview',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Derivatives</strong> are financial contracts whose value derives from underlying assets.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-calendar-alt text-primary"></i>
                                    <span><strong>Futures:</strong> Agreement to buy/sell at future date</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-infinity text-warning"></i>
                                    <span><strong>Perpetuals:</strong> Futures without expiration</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-chart-line text-success"></i>
                                    <span><strong>Leverage:</strong> Control large positions with small capital</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Leverage Example',
                    content: `
                        <div class="lesson-card-content">
                            <p>How leverage amplifies gains and losses:</p>
                            <div class="leverage-example">
                                <div class="scenario">
                                    <h5>10x Leverage Trade</h5>
                                    <p>Capital: $1,000</p>
                                    <p>Position: $10,000</p>
                                    <p>5% price move = $500 profit/loss</p>
                                    <p>= 50% account impact!</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Derivatives Risks',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Key Risks to Understand:</h4>
                            <ul>
                                <li><strong>Liquidation:</strong> Forced position closure</li>
                                <li><strong>Funding Rates:</strong> Cost of holding perpetuals</li>
                                <li><strong>Slippage:</strong> Price impact on large orders</li>
                                <li><strong>Counterparty Risk:</strong> Exchange reliability</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What is the main risk of using high leverage?",
                options: [
                    { value: 'A', text: 'Higher fees' },
                    { value: 'B', text: 'Amplified losses and liquidation risk' },
                    { value: 'C', text: 'Slower execution' }
                ],
                correct: 'B',
                explanation: "Correct! High leverage amplifies both gains and losses, significantly increasing the risk of liquidation if the market moves against you."
            }
        },
        'advanced-risk-models': {
            title: 'Advanced Risk Models',
            cards: [
                {
                    type: 'content',
                    title: 'Risk Measurement',
                    content: `
                        <div class="lesson-card-content">
                            <p><strong>Advanced Risk Models</strong> quantify and manage portfolio risk using mathematical methods.</p>
                            <div class="key-points">
                                <div class="key-point">
                                    <i class="fas fa-chart-area text-danger"></i>
                                    <span><strong>VaR:</strong> Value at Risk - potential loss over time period</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-dice text-primary"></i>
                                    <span><strong>Monte Carlo:</strong> Simulate thousands of scenarios</span>
                                </div>
                                <div class="key-point">
                                    <i class="fas fa-calculator text-success"></i>
                                    <span><strong>Sharpe Ratio:</strong> Risk-adjusted return measure</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'visual',
                    title: 'Risk Metrics',
                    content: `
                        <div class="lesson-card-content">
                            <p>Key risk measurements:</p>
                            <div class="risk-metrics">
                                <div class="metric">
                                    <h5>📊 VaR (95%)</h5>
                                    <p>Maximum expected loss 95% of the time</p>
                                </div>
                                <div class="metric">
                                    <h5>📈 Beta</h5>
                                    <p>Correlation with market movements</p>
                                </div>
                                <div class="metric">
                                    <h5>📉 Maximum Drawdown</h5>
                                    <p>Largest peak-to-trough decline</p>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'strategy',
                    title: 'Portfolio Optimization',
                    content: `
                        <div class="lesson-card-content">
                            <h4>Advanced Portfolio Techniques:</h4>
                            <ul>
                                <li>Modern Portfolio Theory (MPT)</li>
                                <li>Black-Litterman model</li>
                                <li>Risk parity allocation</li>
                                <li>Dynamic hedging strategies</li>
                                <li>Stress testing scenarios</li>
                            </ul>
                        </div>
                    `
                }
            ],
            quiz: {
                question: "What does VaR (Value at Risk) measure?",
                options: [
                    { value: 'A', text: 'Expected returns' },
                    { value: 'B', text: 'Potential loss over a specific time period' },
                    { value: 'C', text: 'Trading volume' }
                ],
                correct: 'B',
                explanation: "Correct! VaR measures the potential loss in portfolio value over a specific time period at a given confidence level."
            }
        }
    };
}

function openLesson(lessonId) {
    // Show page loader
    showPageLoader();
    
    // Simulate loading delay for realistic experience
    setTimeout(() => {
        currentLesson = lessonId;
        currentCard = 0;
        
        const lesson = lessonData[lessonId];
        if (!lesson) {
            console.error('Lesson not found:', lessonId);
            hidePageLoader();
            return;
        }
        
        document.getElementById('lessonTitle').textContent = lesson.title;
        document.getElementById('lessonModal').classList.add('show');
        
        loadLessonCard(0);
        hidePageLoader();
    }, 800); // 800ms loading simulation
}

function closeLessonModal() {
    const modal = document.getElementById('lessonModal');
    modal.classList.remove('show');
    currentLesson = null;
    currentCard = 0;
    
    // Reset modal content
    document.getElementById('lessonCards').innerHTML = '';
    document.getElementById('lessonProgress').style.width = '0%';
    document.getElementById('cardCounter').textContent = '1 / 1';
}

function setupModalEventListeners() {
    // Close modal when clicking outside of it
    const lessonModal = document.getElementById('lessonModal');
    const quizModal = document.getElementById('quizModal');
    
    if (lessonModal) {
        lessonModal.addEventListener('click', function(e) {
            if (e.target === lessonModal) {
                closeLessonModal();
            }
        });
    }
    
    if (quizModal) {
        quizModal.addEventListener('click', function(e) {
            if (e.target === quizModal) {
                closeQuizModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (lessonModal && lessonModal.classList.contains('show')) {
                closeLessonModal();
            }
            if (quizModal && quizModal.classList.contains('show')) {
                closeQuizModal();
            }
        }
    });
}

function loadLessonCard() {
    if (!currentLesson) return;
    
    const lesson = lessonData[currentLesson];
    const card = lesson.cards[currentCard];
    
    // Update progress
    const progress = ((currentCard + 1) / lesson.cards.length) * 100;
    document.getElementById('lessonProgress').style.width = `${progress}%`;
    document.getElementById('cardCounter').textContent = `${currentCard + 1} / ${lesson.cards.length}`;
    
    // Load card content
    document.getElementById('lessonCards').innerHTML = `
        <div class="lesson-card active">
            <h3>${card.title}</h3>
            ${card.content}
        </div>
    `;
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentCard === 0;
    
    const nextBtn = document.getElementById('nextBtn');
    if (currentCard === lesson.cards.length - 1) {
        nextBtn.innerHTML = 'Take Quiz <i class="fas fa-graduation-cap"></i>';
        nextBtn.onclick = startQuiz;
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        nextBtn.onclick = nextCard;
    }
}

function nextCard() {
    if (!currentLesson) return;
    
    const lesson = lessonData[currentLesson];
    if (currentCard < lesson.cards.length - 1) {
        currentCard++;
        loadLessonCard();
    }
}

function previousCard() {
    if (currentCard > 0) {
        currentCard--;
        loadLessonCard();
    }
}

function startQuiz() {
    if (!currentLesson) return;
    
    const lesson = lessonData[currentLesson];
    const quiz = lesson.quiz;
    
    // Hide lesson modal and show quiz modal
    document.getElementById('lessonModal').classList.remove('show');
    document.getElementById('quizModal').classList.add('show');
    
    // Load quiz content
    document.getElementById('quizQuestion').textContent = quiz.question;
    
    const optionsHtml = quiz.options.map(option => `
        <label class="quiz-option">
            <input type="radio" name="quiz" value="${option.value}">
            <span>${option.value}) ${option.text}</span>
        </label>
    `).join('');
    
    document.getElementById('quizOptions').innerHTML = optionsHtml;
    document.getElementById('quizResult').style.display = 'none';
}

function submitQuiz() {
    const selectedAnswer = document.querySelector('input[name="quiz"]:checked');
    if (!selectedAnswer) {
        alert('Please select an answer');
        return;
    }
    
    const lesson = lessonData[currentLesson];
    const quiz = lesson.quiz;
    const isCorrect = selectedAnswer.value === quiz.correct;
    
    // Show result
    const resultDiv = document.getElementById('quizResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="quiz-result-content ${isCorrect ? 'correct' : 'incorrect'}">
            <div class="result-icon">
                <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
            </div>
            <h4>${isCorrect ? 'Correct!' : 'Not quite right'}</h4>
            <p>${quiz.explanation}</p>
            <div class="quiz-actions">
                <button class="btn btn-primary" onclick="completeLesson()">
                    ${isCorrect ? 'Continue to Prediction' : 'Try Again Later'}
                </button>
                <button class="btn btn-secondary" onclick="closeQuizModal()">
                    Back to Learning
                </button>
            </div>
        </div>
    `;
    
    // Save lesson progress
    if (isCorrect) {
        const score = 92; // Simulate score based on performance
        TradeLensStorage.storeLessonProgress(currentUser.id, currentLesson, {
            lessonName: lesson.title,
            completed: true,
            score: score,
            completedAt: new Date().toISOString()
        });
        
        // Update user's completed lessons
        if (!currentUser.completedLessons) currentUser.completedLessons = [];
        if (!currentUser.completedLessons.includes(currentLesson)) {
            currentUser.completedLessons.push(currentLesson);
            TradeLensStorage.updateUser({ completedLessons: currentUser.completedLessons });
        }
    }
}

function completeLesson() {
    closeQuizModal();
    // Redirect to prediction workspace with lesson context
    window.location.href = `prediction.html?lesson=${currentLesson}`;
}

function closeQuizModal() {
    document.getElementById('quizModal').classList.remove('show');
}

function logout() {
    TradeLensStorage.clearUser();
    window.location.href = '../index.html';
}

// Add learning-specific styles
const learningStyles = `
<style>
.main-content {
    padding-top: 5rem;
    min-height: 100vh;
    background: var(--bg-secondary);
}

.learning-header {
    background: white;
    padding: 2rem;
    border-radius: var(--radius-lg);
    margin-bottom: 2rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.header-content p {
    color: var(--text-secondary);
}

.progress-overview {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.level-badge {
    text-align: center;
}

.level-number {
    display: block;
    width: 3rem;
    height: 3rem;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.level-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.overall-progress {
    min-width: 200px;
}

.progress-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
}

.lesson-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.lesson-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
}

.lesson-card:hover:not(.locked) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.lesson-card.completed {
    border-color: var(--success-color);
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), white);
}

.lesson-card.locked {
    opacity: 0.6;
    cursor: not-allowed;
}

.lesson-status {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
}

.lesson-card.completed .lesson-status {
    color: var(--success-color);
}

.lesson-card.available .lesson-status {
    color: var(--primary-color);
}

.lesson-card.locked .lesson-status {
    color: var(--text-light);
}

.lesson-content h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.lesson-content p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.5;
}

.lesson-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.lesson-score {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: var(--success-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
}

.lesson-badge {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: var(--secondary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
}

.unlock-requirement {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: var(--text-light);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    font-weight: 500;
    font-size: 0.75rem;
}

/* Lesson Modal Styles */
.lesson-modal-content, .quiz-modal-content {
    background: white;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.lesson-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lesson-header h2 {
    margin: 0;
    color: var(--text-primary);
}

.close-lesson {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--text-secondary);
    transition: color 0.2s;
}

.close-lesson:hover {
    color: var(--text-primary);
}

.lesson-progress-bar {
    height: 4px;
    background: var(--bg-secondary);
}

.lesson-progress-fill {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.3s ease;
}

.lesson-content-area {
    padding: 2rem;
    min-height: 400px;
}

.lesson-card.active {
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
}

.lesson-card-content {
    line-height: 1.6;
}

.key-points {
    margin: 1.5rem 0;
}

.key-point {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
}

.formula-box, .insight-box, .warning-box {
    padding: 1rem;
    border-radius: var(--radius-md);
    margin: 1.5rem 0;
}

.formula-box {
    background: rgba(99, 102, 241, 0.1);
    border-left: 4px solid var(--primary-color);
}

.insight-box {
    background: rgba(16, 185, 129, 0.1);
    border-left: 4px solid var(--success-color);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.warning-box {
    background: rgba(245, 158, 11, 0.1);
    border-left: 4px solid var(--warning-color);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.chart-example {
    margin: 1.5rem 0;
    border: 2px dashed var(--border-color);
    border-radius: var(--radius-md);
    padding: 1rem;
    background: var(--bg-secondary);
}

.strategy-grid {
    display: grid;
    gap: 1rem;
    margin: 1.5rem 0;
}

.strategy-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
}

.strategy-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
}

.strategy-icon.overbought {
    background: var(--danger-color);
}

.strategy-icon.oversold {
    background: var(--success-color);
}

.strategy-icon.neutral {
    background: var(--info-color);
}

.lesson-navigation {
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
}

.card-counter {
    font-weight: 500;
    color: var(--text-secondary);
}

/* Quiz Styles */
.quiz-header {
    padding: 2rem;
    text-align: center;
    border-bottom: 1px solid var(--border-color);
}

.quiz-content {
    padding: 2rem;
}

.question-area {
    margin-bottom: 2rem;
}

.question-area h3 {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
}

.quiz-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.quiz-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s;
}

.quiz-option:hover {
    border-color: var(--primary-color);
    background: rgba(99, 102, 241, 0.05);
}

.quiz-option input[type="radio"] {
    margin: 0;
}

.quiz-actions {
    text-align: center;
    margin-top: 2rem;
}

.quiz-result-content {
    text-align: center;
    padding: 2rem;
    border-radius: var(--radius-lg);
    margin-top: 2rem;
}

.quiz-result-content.correct {
    background: rgba(16, 185, 129, 0.1);
    border: 2px solid var(--success-color);
}

.quiz-result-content.incorrect {
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid var(--danger-color);
}

.result-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.quiz-result-content.correct .result-icon {
    color: var(--success-color);
}

.quiz-result-content.incorrect .result-icon {
    color: var(--danger-color);
}

.quiz-result-content h4 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.quiz-result-content p {
    margin-bottom: 2rem;
    line-height: 1.6;
}

.quiz-result-content .quiz-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

@media (max-width: 768px) {
    .learning-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .progress-overview {
        flex-direction: column;
        gap: 1rem;
    }
    
    .lesson-grid {
        grid-template-columns: 1fr;
    }
    
    .lesson-modal-content, .quiz-modal-content {
        width: 95%;
        margin: 1rem;
    }
    
    .lesson-navigation {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', learningStyles);
