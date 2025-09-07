// TradeLens Dashboard JavaScript

let currentUser = null;

// Initialize dashboard when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Check authentication
    currentUser = TradeLensStorage.getStoredUser();
    
    if (!currentUser) {
        // Redirect to landing if not logged in
        window.location.href = '../index.html';
        return;
    }
    
    // Load user data and populate dashboard
    loadUserProfile();
    loadUserStats();
    loadRecentActivity();
    updateProgressBars();
}

function loadUserProfile() {
    document.getElementById('userName').textContent = currentUser.displayName;
    document.getElementById('userDisplayName').textContent = currentUser.displayName;
}

function loadUserStats() {
    // Update Trader Health Score
    const healthScore = currentUser.traderHealthScore || 75;
    document.getElementById('healthScore').textContent = healthScore;
    document.getElementById('healthProgress').style.width = `${healthScore}%`;
    
    // Update Learning Progress
    const completedLessons = currentUser.completedLessons?.length || 0;
    const totalLessons = 10; // Total lessons available
    document.getElementById('learningProgress').textContent = completedLessons;
    document.getElementById('lessonProgress').style.width = `${(completedLessons / totalLessons) * 100}%`;
    
    // Update Prediction Accuracy
    const userPredictions = TradeLensStorage.getUserPredictions(currentUser.id);
    const accuracy = calculateAccuracy(userPredictions);
    document.getElementById('predictionAccuracy').textContent = accuracy;
    
    // AI Comparison
    const aiComparison = calculateAIComparison(userPredictions);
    const comparisonElement = document.getElementById('aiComparison');
    comparisonElement.textContent = `${aiComparison > 0 ? '+' : ''}${aiComparison}%`;
    comparisonElement.className = aiComparison > 0 ? 'positive' : 'negative';
    
    // Update Badge Count
    const badgeCount = currentUser.badges?.length || 0;
    document.getElementById('badgeCount').textContent = badgeCount;
    
    // Show recent badges
    updateBadgePreview();
}

function calculateAccuracy(predictions) {
    if (!predictions || predictions.length === 0) return 0;
    
    const completedPredictions = predictions.filter(p => p.result !== undefined);
    if (completedPredictions.length === 0) return 0;
    
    const correctPredictions = completedPredictions.filter(p => p.result === 'win').length;
    return Math.round((correctPredictions / completedPredictions.length) * 100);
}

function calculateAIComparison(predictions) {
    // Simulate AI comparison - in real app this would be calculated from actual AI performance
    return Math.floor(Math.random() * 20) - 5; // Random between -5 and +15
}

function updateBadgePreview() {
    const badgePreview = document.getElementById('badgePreview');
    const badges = currentUser.badges || [];
    
    if (badges.length > 0) {
        const recentBadge = badges[badges.length - 1];
        badgePreview.innerHTML = `<span class="badge badge-success">${recentBadge.name}</span>`;
    } else {
        badgePreview.innerHTML = '<span class="badge badge-secondary">No badges yet</span>';
    }
}

function updateProgressBars() {
    // Animate progress bars
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            bar.style.transition = 'width 1s ease-in-out';
        });
    }, 100);
}

function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    const activities = generateRecentActivities();
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
            <div class="activity-status ${activity.status}">
                ${activity.statusText}
            </div>
        </div>
    `).join('');
}

function generateRecentActivities() {
    const userPredictions = TradeLensStorage.getUserPredictions(currentUser.id);
    const userLessons = TradeLensStorage.getUserLessonProgress(currentUser.id);
    
    const activities = [];
    
    // Add recent predictions
    userPredictions.slice(-3).forEach(prediction => {
        activities.push({
            icon: 'crystal-ball',
            title: `Predicted ${prediction.asset} ${prediction.direction}`,
            time: formatTimeAgo(prediction.createdAt),
            status: prediction.result === 'win' ? 'success' : prediction.result === 'loss' ? 'danger' : 'pending',
            statusText: prediction.result === 'win' ? 'Correct' : prediction.result === 'loss' ? 'Incorrect' : 'Pending'
        });
    });
    
    // Add recent lessons
    userLessons.slice(-2).forEach(lesson => {
        activities.push({
            icon: 'graduation-cap',
            title: `Completed ${lesson.lessonName || 'RSI Basics'}`,
            time: formatTimeAgo(lesson.updatedAt),
            status: 'success',
            statusText: `${lesson.score || 85}%`
        });
    });
    
    // If no activities, add sample ones
    if (activities.length === 0) {
        activities.push(
            {
                icon: 'graduation-cap',
                title: 'Completed RSI Basics Lesson',
                time: '2 hours ago',
                status: 'success',
                statusText: '92%'
            },
            {
                icon: 'crystal-ball',
                title: 'Predicted BTC UP',
                time: '4 hours ago',
                status: 'success',
                statusText: 'Correct'
            },
            {
                icon: 'users',
                title: 'Shared prediction in community',
                time: '1 day ago',
                status: 'info',
                statusText: '12 likes'
            }
        );
    }
    
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
}

function goToVolumeLesson() {
    // Navigate to learning page with volume lesson
    window.location.href = 'learning.html?lesson=volume';
}

function logout() {
    TradeLensStorage.clearUser();
    window.location.href = '../index.html';
}

// Add CSS for dashboard-specific styles
const dashboardStyles = `
<style>
.main-content {
    padding-top: 5rem;
    min-height: 100vh;
    background: var(--bg-secondary);
}

.welcome-section {
    margin-bottom: 2rem;
}

.welcome-card {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    padding: 2rem;
    border-radius: var(--radius-lg);
    text-align: center;
}

.welcome-card h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.stat-icon {
    width: 3rem;
    height: 3rem;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
}

.stat-content {
    flex: 1;
}

.stat-content h3 {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.score-display {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.score-max {
    font-size: 1rem;
    color: var(--text-secondary);
    font-weight: 400;
}

.accuracy-comparison {
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.vs-ai .positive {
    color: var(--success-color);
}

.vs-ai .negative {
    color: var(--danger-color);
}

.badge-preview {
    margin-top: 0.5rem;
}

.quick-actions, .recent-activity, .ai-insights {
    margin-bottom: 3rem;
}

.quick-actions h2, .recent-activity h2, .ai-insights h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
}

.action-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.action-card {
    background: white;
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    text-decoration: none;
    color: inherit;
    transition: all 0.3s;
    position: relative;
}

.action-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.action-icon {
    width: 3rem;
    height: 3rem;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
    margin-bottom: 1rem;
}

.action-card h3 {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.action-card p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.action-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--secondary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 600;
}

.activity-list {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.activity-item {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    gap: 1rem;
}

.activity-item:last-child {
    border-bottom: none;
}

.activity-icon {
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-secondary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
}

.activity-content {
    flex: 1;
}

.activity-title {
    font-weight: 500;
    color: var(--text-primary);
}

.activity-time {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.activity-status {
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 600;
}

.activity-status.success {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success-color);
}

.activity-status.danger {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger-color);
}

.activity-status.pending {
    background: rgba(245, 158, 11, 0.1);
    color: var(--warning-color);
}

.activity-status.info {
    background: rgba(59, 130, 246, 0.1);
    color: var(--info-color);
}

.insight-card {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.insight-header {
    background: var(--bg-secondary);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.insight-header i {
    color: var(--primary-color);
    font-size: 1.25rem;
}

.insight-header h3 {
    margin: 0;
    color: var(--text-primary);
}

.insight-content {
    padding: 1.5rem;
}

.insight-content p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.insight-actions {
    display: flex;
    gap: 1rem;
}

.user-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.nav-link.active {
    color: var(--primary-color);
    font-weight: 600;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .action-grid {
        grid-template-columns: 1fr;
    }
    
    .stat-card {
        flex-direction: column;
        text-align: center;
    }
    
    .user-menu {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', dashboardStyles);
