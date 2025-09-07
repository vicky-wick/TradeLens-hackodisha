// TradeLens Prediction Workspace JavaScript

let currentUser = null;
let selectedAsset = 'BTC';
let selectedTimeframe = '1h';
let selectedDirection = null;
let currentConfidence = 50;
let currentPrediction = null;

// Initialize prediction workspace when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializePrediction();
});

function initializePrediction() {
    // Check authentication
    currentUser = TradeLensStorage.getStoredUser();
    
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    // Load user profile
    document.getElementById('userName').textContent = currentUser.displayName;
    
    // Check for lesson context
    const urlParams = new URLSearchParams(window.location.search);
    const lessonParam = urlParams.get('lesson');
    if (lessonParam) {
        showLessonContext(lessonParam);
    }
    
    // Initialize form interactions
    initializeFormHandlers();
    
    // Update current price
    updateCurrentPrice();
    
    // Start price updates
    setInterval(updateCurrentPrice, 30000); // Update every 30 seconds
}

function showLessonContext(lesson) {
    const contextElement = document.getElementById('lessonContext');
    const lessonNames = {
        'rsi-basics': 'Apply your RSI knowledge',
        'volume-analysis': 'Use volume analysis skills'
    };
    
    if (lessonNames[lesson]) {
        contextElement.style.display = 'flex';
        contextElement.querySelector('span').textContent = lessonNames[lesson];
    }
}

function initializeFormHandlers() {
    // Timeframe buttons
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedTimeframe = this.dataset.timeframe;
            updateChartTimeframe();
        });
    });
    
    // Direction buttons
    document.querySelectorAll('.direction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.direction-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedDirection = this.dataset.direction;
        });
    });
}

function updateAssetPrice() {
    selectedAsset = document.getElementById('assetSelect').value;
    updateCurrentPrice();
    updateChartAsset();
}

function updateCurrentPrice() {
    const priceData = MLMentor.getCurrentPrice(selectedAsset);
    const priceElement = document.querySelector('.price-value');
    const changeElement = document.querySelector('.price-change');
    
    // Format price based on asset
    let formattedPrice;
    if (selectedAsset === 'BTC') {
        formattedPrice = `$${priceData.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    } else if (selectedAsset === 'ETH') {
        formattedPrice = `$${priceData.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    } else {
        formattedPrice = `$${priceData.price.toFixed(4)}`;
    }
    
    priceElement.textContent = formattedPrice;
    
    // Update change indicator
    const changeText = `${priceData.change >= 0 ? '+' : ''}${priceData.change.toFixed(2)}%`;
    changeElement.textContent = changeText;
    changeElement.className = `price-change ${priceData.change >= 0 ? 'positive' : 'negative'}`;
}

function updateChartTimeframe() {
    const chartTitle = document.querySelector('.chart-title');
    chartTitle.textContent = `${selectedAsset}/USD - ${selectedTimeframe.toUpperCase()} Chart`;
}

function updateChartAsset() {
    const chartTitle = document.querySelector('.chart-title');
    chartTitle.textContent = `${selectedAsset}/USD - ${selectedTimeframe.toUpperCase()} Chart`;
    
    // Update price line
    const priceData = MLMentor.getCurrentPrice(selectedAsset);
    const priceLine = document.querySelector('.current-price-line');
    
    if (selectedAsset === 'BTC') {
        priceLine.textContent = `$${Math.round(priceData.price).toLocaleString()}`;
    } else if (selectedAsset === 'ETH') {
        priceLine.textContent = `$${Math.round(priceData.price).toLocaleString()}`;
    } else {
        priceLine.textContent = `$${priceData.price.toFixed(3)}`;
    }
}

function updateConfidence(value) {
    currentConfidence = parseInt(value);
    document.getElementById('confidenceValue').textContent = value;
    
    // Update slider color based on confidence
    const slider = document.getElementById('confidenceSlider');
    const percentage = (value - 10) / 90 * 100;
    slider.style.background = `linear-gradient(90deg, var(--primary-color) ${percentage}%, var(--bg-secondary) ${percentage}%)`;
}

function showIndicator(indicator) {
    // Update chart control buttons
    document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide indicators
    const rsiIndicator = document.getElementById('rsiIndicator');
    if (indicator === 'rsi') {
        rsiIndicator.style.display = 'block';
    } else {
        rsiIndicator.style.display = 'none';
    }
}

function submitPrediction(event) {
    event.preventDefault();
    
    // Validate form
    if (!selectedDirection) {
        alert('Please select a price direction');
        return;
    }
    
    const rationale = document.getElementById('rationale').value.trim();
    if (!rationale) {
        alert('Please provide your rationale');
        return;
    }
    
    // Create user prediction
    const userPrediction = {
        userId: currentUser.id,
        asset: selectedAsset,
        timeframe: selectedTimeframe,
        direction: selectedDirection,
        confidence: currentConfidence,
        rationale: rationale,
        timestamp: new Date().toISOString()
    };
    
    // Store prediction
    currentPrediction = TradeLensStorage.storePrediction(userPrediction);
    
    // Get AI mentor prediction
    const aiPrediction = MLMentor.generatePrediction(selectedAsset, selectedTimeframe);
    
    // Show comparison modal
    showMentorComparison(userPrediction, aiPrediction);
}

function showMentorComparison(userPrediction, aiPrediction) {
    // Populate user prediction display
    const userDisplay = document.getElementById('userPredictionDisplay');
    userDisplay.innerHTML = `
        <div class="prediction-direction ${userPrediction.direction.toLowerCase()}">
            <i class="fas fa-arrow-${getDirectionIcon(userPrediction.direction)}"></i>
            <span>${userPrediction.direction}</span>
        </div>
        <div class="prediction-confidence">
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${userPrediction.confidence}%"></div>
            </div>
            <span>${userPrediction.confidence}% confidence</span>
        </div>
        <div class="prediction-rationale">
            <strong>Your reasoning:</strong>
            <p>"${userPrediction.rationale}"</p>
        </div>
    `;
    
    // Populate AI prediction display
    const aiDisplay = document.getElementById('aiPredictionDisplay');
    aiDisplay.innerHTML = `
        <div class="prediction-direction ${aiPrediction.direction.toLowerCase()}">
            <i class="fas fa-robot"></i>
            <span>${aiPrediction.direction}</span>
        </div>
        <div class="prediction-confidence">
            <div class="confidence-bar">
                <div class="confidence-fill ai" style="width: ${aiPrediction.confidence}%"></div>
            </div>
            <span>${aiPrediction.confidence}% confidence</span>
        </div>
        <div class="ai-reasoning">
            <strong>AI reasoning:</strong>
            <p>"${aiPrediction.reasoning}"</p>
        </div>
    `;
    
    // Generate and show explanation
    const explanation = MLMentor.generateExplanation(aiPrediction);
    const explanationContent = document.getElementById('explanationContent');
    explanationContent.innerHTML = `
        <div class="explanation-text">
            ${explanation.map(text => `<p>${text}</p>`).join('')}
        </div>
    `;
    
    // Show feature importance
    const featureList = document.getElementById('featureList');
    featureList.innerHTML = aiPrediction.features.map(feature => `
        <div class="feature-item">
            <div class="feature-name">${feature.name}</div>
            <div class="feature-bar">
                <div class="feature-fill ${feature.impact}" style="width: ${feature.importance * 100}%"></div>
            </div>
            <div class="feature-importance">${Math.round(feature.importance * 100)}%</div>
        </div>
    `).join('');
    
    // Generate risk assessment
    const riskAssessment = MLMentor.generateRiskAssessment(aiPrediction, userPrediction);
    const riskContent = document.getElementById('riskContent');
    riskContent.innerHTML = `
        <div class="risk-level ${riskAssessment.level.toLowerCase()}">
            <i class="fas fa-shield-alt"></i>
            <span>Risk Level: ${riskAssessment.level}</span>
        </div>
        <div class="risk-recommendations">
            <h4>Recommendations:</h4>
            <ul>
                ${riskAssessment.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        <div class="risk-levels">
            <div class="risk-item">
                <span>Stop Loss:</span>
                <span class="risk-value">${riskAssessment.stopLoss}</span>
            </div>
            <div class="risk-item">
                <span>Take Profit:</span>
                <span class="risk-value">${riskAssessment.takeProfit}</span>
            </div>
            <div class="risk-item">
                <span>Health Impact:</span>
                <span class="risk-value ${riskAssessment.traderHealthImpact.startsWith('+') ? 'positive' : 'negative'}">
                    ${riskAssessment.traderHealthImpact}
                </span>
            </div>
        </div>
    `;
    
    // Show modal
    document.getElementById('mentorModal').classList.add('show');
}

function getDirectionIcon(direction) {
    const icons = {
        'UP': 'up',
        'DOWN': 'down',
        'FLAT': 'arrows-alt-h'
    };
    return icons[direction] || 'question';
}

function closeMentorModal() {
    document.getElementById('mentorModal').classList.remove('show');
}

function shareToCommunity() {
    if (!currentPrediction) return;
    
    // Create community post
    const post = {
        userId: currentUser.id,
        userName: currentUser.displayName,
        content: `Just made a ${currentPrediction.direction} prediction for ${currentPrediction.asset} with ${currentPrediction.confidence}% confidence. ${currentPrediction.rationale}`,
        predictionId: currentPrediction.id,
        asset: currentPrediction.asset,
        prediction: currentPrediction.direction,
        confidence: currentPrediction.confidence
    };
    
    TradeLensStorage.storeCommunityPost(post);
    
    // Show success message
    alert('Prediction shared to community! 🎉');
    
    // Redirect to community
    window.location.href = 'community.html';
}

function makeAnotherPrediction() {
    closeMentorModal();
    
    // Reset form
    document.querySelectorAll('.direction-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('rationale').value = '';
    document.getElementById('confidenceSlider').value = 50;
    updateConfidence(50);
    selectedDirection = null;
    currentPrediction = null;
}

function logout() {
    TradeLensStorage.clearUser();
    window.location.href = '../index.html';
}

// Add prediction-specific styles
const predictionStyles = `
<style>
.main-content {
    padding-top: 5rem;
    min-height: 100vh;
    background: var(--bg-secondary);
}

.prediction-header {
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

.current-price {
    text-align: right;
}

.price-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.price-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0.25rem 0;
}

.price-change {
    font-size: 1rem;
    font-weight: 600;
}

.price-change.positive {
    color: var(--success-color);
}

.price-change.negative {
    color: var(--danger-color);
}

.workspace-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.prediction-panel, .chart-panel {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
}

.panel-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header h2 {
    margin: 0;
    color: var(--text-primary);
}

.lesson-context {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--primary-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
}

.prediction-form {
    padding: 2rem;
}

.form-group {
    margin-bottom: 2rem;
}

.form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
}

.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: 1rem;
    background: white;
}

.timeframe-buttons, .direction-buttons {
    display: flex;
    gap: 0.5rem;
}

.timeframe-btn, .direction-btn {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    background: white;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
}

.timeframe-btn:hover, .direction-btn:hover {
    border-color: var(--primary-color);
}

.timeframe-btn.active, .direction-btn.active {
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: white;
}

.direction-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
}

.direction-btn.up.active {
    background: var(--success-color);
    border-color: var(--success-color);
}

.direction-btn.down.active {
    background: var(--danger-color);
    border-color: var(--danger-color);
}

.direction-btn.flat.active {
    background: var(--warning-color);
    border-color: var(--warning-color);
}

.direction-btn i {
    font-size: 1.5rem;
}

.confidence-slider-container {
    position: relative;
}

.confidence-slider-container input[type="range"] {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: var(--bg-secondary);
    outline: none;
    -webkit-appearance: none;
}

.confidence-slider-container input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
}

.confidence-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: 1rem;
    resize: vertical;
    font-family: inherit;
}

.rationale-tips {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.rationale-tips i {
    color: var(--warning-color);
}

.prediction-submit {
    width: 100%;
    justify-content: center;
}

.chart-controls {
    display: flex;
    gap: 0.5rem;
}

.chart-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    background: white;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
}

.chart-btn:hover {
    background: var(--bg-secondary);
}

.chart-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.chart-container {
    padding: 2rem;
    height: 400px;
}

.mock-chart {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.chart-title {
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.price-chart-mock {
    flex: 1;
    position: relative;
    background: linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%);
    border-radius: var(--radius-md);
    padding: 1rem;
}

.candle-container {
    position: relative;
    height: 100%;
}

.candle {
    position: absolute;
    bottom: 0;
    width: 8px;
    background: var(--success-color);
    border-radius: 2px;
}

.candle.red {
    background: var(--danger-color);
}

.candle.current {
    background: var(--primary-color);
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
}

.current-price-line {
    position: absolute;
    top: 25%;
    right: 1rem;
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 600;
}

.rsi-indicator {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    display: none;
}

.indicator-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.rsi-chart {
    position: relative;
    height: 60px;
    background: white;
    border-radius: var(--radius-sm);
    margin-bottom: 0.5rem;
}

.rsi-levels {
    position: absolute;
    width: 100%;
    height: 100%;
}

.rsi-line {
    position: absolute;
    width: 100%;
    border-top: 1px dashed;
    font-size: 0.75rem;
    padding-left: 0.5rem;
}

.rsi-line.overbought {
    top: 20%;
    border-color: var(--danger-color);
    color: var(--danger-color);
}

.rsi-line.oversold {
    bottom: 20%;
    border-color: var(--success-color);
    color: var(--success-color);
}

.rsi-value {
    position: absolute;
    right: 1rem;
    background: var(--warning-color);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 600;
}

.rsi-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.rsi-status.overbought {
    color: var(--danger-color);
}

.market-insights {
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
}

.market-insights h3 {
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.insight-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.insight-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
}

.insight-item i {
    width: 1.25rem;
    text-align: center;
}

/* Mentor Modal Styles */
.mentor-modal-content {
    background: white;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    width: 90%;
    max-width: 1000px;
    max-height: 90vh;
    overflow-y: auto;
}

.mentor-header {
    padding: 2rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
}

.mentor-header h2 {
    margin: 0;
}

.mentor-header .close {
    color: white;
    font-size: 2rem;
}

.comparison-section {
    padding: 2rem;
}

.prediction-comparison {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: center;
}

.user-prediction, .ai-prediction {
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    border: 2px solid var(--border-color);
}

.user-prediction {
    border-color: var(--primary-color);
    background: rgba(99, 102, 241, 0.05);
}

.ai-prediction {
    border-color: var(--secondary-color);
    background: rgba(245, 158, 11, 0.05);
}

.vs-divider {
    width: 3rem;
    height: 3rem;
    background: var(--text-secondary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
}

.prediction-display h3 {
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.prediction-direction {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.prediction-direction.up {
    color: var(--success-color);
}

.prediction-direction.down {
    color: var(--danger-color);
}

.prediction-direction.flat {
    color: var(--warning-color);
}

.confidence-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.confidence-fill {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.3s ease;
}

.confidence-fill.ai {
    background: var(--secondary-color);
}

.mentor-explanation, .risk-assessment {
    padding: 2rem;
    border-top: 1px solid var(--border-color);
}

.mentor-explanation h3, .risk-assessment h3 {
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.explanation-text p {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: var(--text-secondary);
}

.feature-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.feature-item {
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    gap: 1rem;
    align-items: center;
}

.feature-name {
    font-weight: 500;
    color: var(--text-primary);
}

.feature-bar {
    height: 8px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow: hidden;
}

.feature-fill {
    height: 100%;
    transition: width 0.3s ease;
}

.feature-fill.positive {
    background: var(--success-color);
}

.feature-fill.negative {
    background: var(--danger-color);
}

.feature-fill.neutral {
    background: var(--text-secondary);
}

.feature-importance {
    font-weight: 600;
    color: var(--text-primary);
}

.risk-level {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
}

.risk-level.low {
    color: var(--success-color);
}

.risk-level.medium {
    color: var(--warning-color);
}

.risk-level.high {
    color: var(--danger-color);
}

.risk-recommendations ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
}

.risk-recommendations li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
}

.risk-levels {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
}

.risk-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
}

.risk-value.positive {
    color: var(--success-color);
    font-weight: 600;
}

.risk-value.negative {
    color: var(--danger-color);
    font-weight: 600;
}

.mentor-actions {
    padding: 2rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: 1rem;
    justify-content: center;
}

@media (max-width: 768px) {
    .prediction-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .workspace-grid {
        grid-template-columns: 1fr;
    }
    
    .prediction-comparison {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .vs-divider {
        transform: rotate(90deg);
    }
    
    .mentor-actions {
        flex-direction: column;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', predictionStyles);
