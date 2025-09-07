// TradeLens Community Feed JavaScript

let currentUser = null;
let currentFilter = 'all';
let currentSort = 'recent';
let currentPostId = null;

// Initialize community feed when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunity();
});

function initializeCommunity() {
    // Check authentication
    currentUser = TradeLensStorage.getStoredUser();
    
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }
    
    // Load user profile
    document.getElementById('userName').textContent = currentUser.displayName;
    
    // Load community feed
    loadCommunityFeed();
}

function loadCommunityFeed() {
    const posts = TradeLensStorage.getStoredCommunityPosts();
    const filteredPosts = filterPosts(posts);
    const sortedPosts = sortPosts(filteredPosts);
    
    displayPosts(sortedPosts);
}

function filterPosts(posts) {
    switch (currentFilter) {
        case 'predictions':
            return posts.filter(post => post.predictionId);
        case 'insights':
            return posts.filter(post => post.content.toLowerCase().includes('ai') || 
                                      post.content.toLowerCase().includes('mentor'));
        case 'following':
            // Mock following logic - in real app would check user's following list
            return posts.filter(post => Math.random() > 0.7);
        default:
            return posts;
    }
}

function sortPosts(posts) {
    switch (currentSort) {
        case 'popular':
            return posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        case 'accurate':
            return posts.filter(p => p.predictionId).sort((a, b) => {
                // Mock accuracy sorting - in real app would use actual prediction results
                return Math.random() - 0.5;
            });
        default: // recent
            return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}

function displayPosts(posts) {
    const feedContainer = document.getElementById('feedPosts');
    
    if (posts.length === 0) {
        feedContainer.innerHTML = `
            <div class="empty-feed">
                <i class="fas fa-comments"></i>
                <h3>No posts found</h3>
                <p>Be the first to share your prediction!</p>
                <button class="btn btn-primary" onclick="showPostModal()">
                    <i class="fas fa-plus"></i>
                    Create Post
                </button>
            </div>
        `;
        return;
    }
    
    feedContainer.innerHTML = posts.map(post => createPostHTML(post)).join('');
}

function createPostHTML(post) {
    const timeAgo = formatTimeAgo(post.createdAt);
    const isLiked = post.likedBy && post.likedBy.includes(currentUser.id);
    
    return `
        <div class="feed-post" data-post-id="${post.id}">
            <div class="post-header">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <div class="user-name">${post.userName}</div>
                        <div class="post-time">${timeAgo}</div>
                    </div>
                </div>
                <div class="post-menu">
                    <button class="menu-btn" onclick="togglePostMenu('${post.id}')">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            
            <div class="post-content">
                <p>${post.content}</p>
                ${post.predictionId ? createPredictionCard(post) : ''}
            </div>
            
            <div class="post-actions">
                <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes || 0}</span>
                </button>
                <button class="action-btn" onclick="showComments('${post.id}')">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments ? post.comments.length : 0}</span>
                </button>
                <button class="action-btn" onclick="sharePost('${post.id}')">
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                </button>
                ${post.predictionId ? `
                <button class="action-btn prediction-btn" onclick="viewPredictionDetails('${post.predictionId}')">
                    <i class="fas fa-chart-line"></i>
                    <span>View Analysis</span>
                </button>
                ` : ''}
            </div>
        </div>
    `;
}

function createPredictionCard(post) {
    if (!post.predictionId) return '';
    
    const directionClass = post.prediction ? post.prediction.toLowerCase() : 'neutral';
    const directionIcon = getDirectionIcon(post.prediction);
    
    return `
        <div class="prediction-card-mini">
            <div class="prediction-header-mini">
                <div class="asset-info">
                    <span class="asset-name">${post.asset || 'BTC'}</span>
                    <span class="prediction-direction ${directionClass}">
                        <i class="fas fa-${directionIcon}"></i>
                        ${post.prediction || 'UP'}
                    </span>
                </div>
                <div class="confidence-mini">
                    <span>${post.confidence || 75}% confidence</span>
                    <div class="confidence-bar-mini">
                        <div class="confidence-fill-mini" style="width: ${post.confidence || 75}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getDirectionIcon(direction) {
    const icons = {
        'UP': 'arrow-up',
        'DOWN': 'arrow-down',
        'FLAT': 'arrows-alt-h'
    };
    return icons[direction] || 'arrow-up';
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

function filterFeed(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Reload feed
    loadCommunityFeed();
}

function sortFeed(sortBy) {
    currentSort = sortBy;
    loadCommunityFeed();
}

function toggleLike(postId) {
    const post = TradeLensStorage.likeCommunityPost(postId, currentUser.id);
    if (post) {
        // Update UI
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);
        const likeBtn = postElement.querySelector('.action-btn');
        const likeCount = likeBtn.querySelector('span');
        
        likeBtn.classList.toggle('liked');
        likeCount.textContent = post.likes || 0;
    }
}

function showComments(postId) {
    currentPostId = postId;
    const posts = TradeLensStorage.getStoredCommunityPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    // Load comments
    const commentsSection = document.getElementById('commentsSection');
    const comments = post.comments || [];
    
    if (comments.length === 0) {
        commentsSection.innerHTML = `
            <div class="no-comments">
                <i class="fas fa-comment"></i>
                <p>No comments yet. Be the first to comment!</p>
            </div>
        `;
    } else {
        commentsSection.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.userName}</span>
                        <span class="comment-time">${formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p class="comment-text">${comment.content}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Show modal
    document.getElementById('commentModal').classList.add('show');
}

function hideCommentModal() {
    document.getElementById('commentModal').classList.remove('show');
    currentPostId = null;
}

function addComment(event) {
    event.preventDefault();
    
    if (!currentPostId) return;
    
    const commentInput = document.getElementById('commentInput');
    const content = commentInput.value.trim();
    
    if (!content) return;
    
    const comment = {
        userId: currentUser.id,
        userName: currentUser.displayName,
        content: content
    };
    
    TradeLensStorage.addCommentToPost(currentPostId, comment);
    
    // Clear input
    commentInput.value = '';
    
    // Reload comments
    showComments(currentPostId);
    
    // Update post comment count in feed
    loadCommunityFeed();
}

function showPostModal() {
    document.getElementById('postModal').classList.add('show');
}

function hidePostModal() {
    document.getElementById('postModal').classList.remove('show');
    
    // Clear form
    document.getElementById('postContent').value = '';
    document.getElementById('quickAsset').value = '';
    document.getElementById('quickDirection').value = '';
    document.getElementById('quickConfidence').value = '';
}

function addQuickPrediction() {
    const asset = document.getElementById('quickAsset').value;
    const direction = document.getElementById('quickDirection').value;
    const confidence = document.getElementById('quickConfidence').value;
    
    if (!asset || !direction || !confidence) {
        alert('Please fill in all prediction fields');
        return;
    }
    
    const postContent = document.getElementById('postContent');
    const predictionText = `\n\n🎯 Prediction: ${asset} ${direction} with ${confidence}% confidence`;
    postContent.value += predictionText;
    
    // Clear quick form
    document.getElementById('quickAsset').value = '';
    document.getElementById('quickDirection').value = '';
    document.getElementById('quickConfidence').value = '';
}

function createPost(event) {
    event.preventDefault();
    
    const content = document.getElementById('postContent').value.trim();
    if (!content) return;
    
    // Check if post contains prediction info
    const predictionMatch = content.match(/🎯 Prediction: (\w+) (\w+) with (\d+)% confidence/);
    let postData = {
        userId: currentUser.id,
        userName: currentUser.displayName,
        content: content
    };
    
    if (predictionMatch) {
        postData.asset = predictionMatch[1];
        postData.prediction = predictionMatch[2];
        postData.confidence = parseInt(predictionMatch[3]);
        postData.predictionId = TradeLensStorage.generateId();
    }
    
    // Store post
    TradeLensStorage.storeCommunityPost(postData);
    
    // Hide modal and reload feed
    hidePostModal();
    loadCommunityFeed();
    
    // Show success message
    showAlert('Post shared successfully! 🎉', 'success');
}

function sharePost(postId) {
    // Mock share functionality
    navigator.clipboard.writeText(`Check out this prediction on TradeLens! Post ID: ${postId}`);
    showAlert('Post link copied to clipboard!', 'info');
}

function viewPredictionDetails(predictionId) {
    // Navigate to prediction details (mock)
    showAlert('Prediction analysis coming soon!', 'info');
}

function togglePostMenu(postId) {
    // Mock post menu functionality
    showAlert('Post options coming soon!', 'info');
}

function loadMorePosts() {
    // Mock load more functionality
    showAlert('All posts loaded!', 'info');
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        ${message}
    `;
    
    document.body.insertBefore(alert, document.body.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        danger: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function logout() {
    TradeLensStorage.clearUser();
    window.location.href = '../index.html';
}

// Add community-specific styles
const communityStyles = `
<style>
.main-content {
    padding-top: 5rem;
    min-height: 100vh;
    background: var(--bg-secondary);
}

.community-header {
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

.community-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-item {
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
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

.stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
}

.stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.feed-filters {
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    margin-bottom: 2rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.filter-tabs {
    display: flex;
    gap: 0.5rem;
}

.filter-tab {
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--border-color);
    background: white;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
}

.filter-tab:hover {
    background: var(--bg-secondary);
}

.filter-tab.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.sort-options select {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: white;
    font-size: 0.875rem;
}

.feed-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.feed-post {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: all 0.3s;
}

.feed-post:hover {
    box-shadow: var(--shadow-md);
}

.post-header {
    padding: 1.5rem 1.5rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-avatar {
    font-size: 2.5rem;
    color: var(--primary-color);
}

.user-name {
    font-weight: 600;
    color: var(--text-primary);
}

.post-time {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.menu-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    transition: all 0.2s;
}

.menu-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.post-content {
    padding: 0 1.5rem 1rem;
}

.post-content p {
    line-height: 1.6;
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.prediction-card-mini {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: 1rem;
    margin-top: 1rem;
    border-left: 4px solid var(--primary-color);
}

.prediction-header-mini {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.asset-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.asset-name {
    font-weight: 600;
    color: var(--text-primary);
}

.prediction-direction {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
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

.confidence-mini {
    text-align: right;
}

.confidence-mini span {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.confidence-bar-mini {
    width: 100px;
    height: 4px;
    background: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 0.25rem;
}

.confidence-fill-mini {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.3s ease;
}

.post-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: 1rem;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.action-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.action-btn.liked {
    color: var(--danger-color);
    border-color: var(--danger-color);
    background: rgba(239, 68, 68, 0.1);
}

.prediction-btn {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.prediction-btn:hover {
    background: var(--primary-dark);
}

.empty-feed {
    background: white;
    padding: 4rem 2rem;
    border-radius: var(--radius-lg);
    text-align: center;
    box-shadow: var(--shadow-sm);
}

.empty-feed i {
    font-size: 4rem;
    color: var(--text-light);
    margin-bottom: 1rem;
}

.empty-feed h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.empty-feed p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

.load-more {
    text-align: center;
    margin-top: 2rem;
}

/* Modal Styles */
.post-modal-content, .comment-modal-content {
    background: white;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    color: var(--text-primary);
}

.post-form {
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

.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: 1rem;
    resize: vertical;
    font-family: inherit;
}

.prediction-quick-add {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    margin-bottom: 2rem;
}

.prediction-quick-add h4 {
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.quick-prediction-form {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 0.75rem;
    align-items: end;
}

.quick-prediction-form select,
.quick-prediction-form input {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
}

.post-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

/* Comment Styles */
.comments-section {
    max-height: 400px;
    overflow-y: auto;
    padding: 1rem 2rem;
}

.comment-item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.comment-avatar {
    font-size: 2rem;
    color: var(--primary-color);
}

.comment-content {
    flex: 1;
}

.comment-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.comment-author {
    font-weight: 600;
    color: var(--text-primary);
}

.comment-time {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.comment-text {
    line-height: 1.5;
    color: var(--text-primary);
}

.no-comments {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.no-comments i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.comment-form {
    padding: 1rem 2rem 2rem;
    border-top: 1px solid var(--border-color);
}

.comment-input-group {
    display: flex;
    gap: 1rem;
    align-items: end;
}

.comment-input-group textarea {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    resize: none;
    font-family: inherit;
}

.comment-input-group button {
    padding: 0.75rem;
    aspect-ratio: 1;
}

@media (max-width: 768px) {
    .community-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .community-stats {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .feed-filters {
        flex-direction: column;
        gap: 1rem;
    }
    
    .filter-tabs {
        flex-wrap: wrap;
    }
    
    .post-actions {
        flex-wrap: wrap;
    }
    
    .quick-prediction-form {
        grid-template-columns: 1fr;
    }
    
    .comment-input-group {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', communityStyles);
