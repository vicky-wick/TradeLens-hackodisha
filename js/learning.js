// TradeLens Learning Hub JavaScript

let currentUser = null;
let currentLesson = null;
let currentCard = 0;
let lessonData = {};

// Initialize learning hub when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeLearning();
});

function initializeLearning() {
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
    
    // Check for lesson parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const lessonParam = urlParams.get('lesson');
    if (lessonParam) {
        openLesson(lessonParam);
    }
}

function initializeLessonData() {
    lessonData = {
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
        }
    };
}

function openLesson(lessonId) {
    if (!lessonData[lessonId]) return;
    
    currentLesson = lessonId;
    currentCard = 0;
    
    const lesson = lessonData[lessonId];
    document.getElementById('lessonTitle').textContent = lesson.title;
    
    // Show modal
    document.getElementById('lessonModal').classList.add('show');
    
    // Load first card
    loadLessonCard();
}

function closeLessonModal() {
    document.getElementById('lessonModal').classList.remove('show');
    currentLesson = null;
    currentCard = 0;
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
    justify-content: space-between;
    align-items: center;
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
