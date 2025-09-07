// TradeLens Enhanced Community Feed JavaScript

let currentUser = null;
let currentPostId = null;
let communityData = null;

// Initialize community data when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    currentUser = TradeLensStorage.getStoredUser();
    
    // Allow access to community page without authentication
    // if (!currentUser) {
    //     window.location.href = 'login.html?redirect=community.html';
    //     return;
    // }
    
    // Load user profile
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.displayName;
    } else {
        document.getElementById('userName').textContent = 'Guest';
    }
    
    // Show loading state
    const feedContainer = document.getElementById('feedPosts');
    feedContainer.innerHTML = `
        <div class="loading-state">
            <div class="jumping-cube-loader">
                <div></div><div></div><div></div><div></div>
            </div>
            <p>Loading community posts...</p>
        </div>
    `;
    
    // Initialize data manager with async loading
    communityData = new CommunityDataManager();
    await communityData.initialize();
    
    // Update crypto post counts
    updateCryptoPostCounts();
    
    // Load community feed
    loadCommunityFeed();
    
    // Add event listeners for share buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.share-btn')) {
            const shareBtn = e.target.closest('.share-btn');
            const postId = shareBtn.getAttribute('data-post-id');
            console.log('Share button clicked via event listener:', postId);
            sharePost(postId);
        }
    });
});


function loadCommunityFeed() {
    const posts = communityData.getFilteredPosts();
    displayPosts(posts);
}

// Update crypto post counts in tabs
function updateCryptoPostCounts() {
    const counts = communityData.getCryptoPostCounts();
    
    Object.keys(counts).forEach(crypto => {
        const tab = document.querySelector(`[data-crypto="${crypto}"]`);
        if (tab) {
            const countElement = tab.querySelector('.post-count');
            if (countElement) {
                countElement.textContent = counts[crypto];
            }
        }
    });
}

// Filter by cryptocurrency
function filterByCrypto(crypto) {
    communityData.currentCrypto = crypto;
    
    // Update active tab
    document.querySelectorAll('.crypto-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-crypto="${crypto}"]`).classList.add('active');
    
    // Clear trend filter when switching crypto
    communityData.currentTrend = null;
    document.querySelectorAll('.trending-tag').forEach(tag => tag.classList.remove('active'));
    
    // Reload feed
    loadCommunityFeed();
}

// Filter by trending topic
function filterByTrend(trend) {
    communityData.currentTrend = trend;
    
    // Update active trending tag
    document.querySelectorAll('.trending-tag').forEach(tag => tag.classList.remove('active'));
    event.target.classList.add('active');
    
    // Reload feed
    loadCommunityFeed();
}

function filterFeed(filter) {
    communityData.currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Reload feed
    loadCommunityFeed();
}

function sortFeed(sortBy) {
    communityData.currentSort = sortBy;
    loadCommunityFeed();
}

function displayPosts(posts) {
    const feedContainer = document.getElementById('feedPosts');
    
    if (posts.length === 0) {
        const cryptoText = communityData.currentCrypto === 'ALL' ? 'this filter' : communityData.currentCrypto;
        feedContainer.innerHTML = `
            <div class="empty-feed">
                <i class="fas fa-comments"></i>
                <h3>No posts found</h3>
                <p>Be the first to share something about ${cryptoText}!</p>
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
    const badgeIcon = communityData.getBadgeIcon(post.userBadge);
    const cryptoIcon = communityData.getCryptoIcon(post.cryptoSymbol);
    
    return `
        <div class="feed-post" data-post-id="${post.id}">
            <div class="post-header">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <div class="user-name">
                            ${post.userName}
                            <i class="${badgeIcon} user-badge" title="${post.userBadge}"></i>
                        </div>
                        <div class="post-meta">
                            <span class="post-time">${timeAgo}</span>
                            <span class="post-crypto">
                                <i class="${cryptoIcon}"></i>
                                ${post.cryptoSymbol}
                            </span>
                            <span class="post-type">${post.postType}</span>
                        </div>
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
                ${post.prediction ? createPredictionCard(post) : ''}
                ${post.tags ? createTagsHTML(post.tags) : ''}
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
                <button class="action-btn share-btn" data-post-id="${post.id}" onclick="sharePost('${post.id}')">
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                </button>
                ${post.prediction ? `
                <button class="action-btn prediction-btn" onclick="viewPredictionDetails('${post.id}')">
                    <i class="fas fa-chart-line"></i>
                    <span>Analysis</span>
                </button>
                ` : ''}
            </div>
        </div>
    `;
}

function createTagsHTML(tags) {
    if (!tags || tags.length === 0) return '';
    
    return `
        <div class="post-tags">
            ${tags.map(tag => `<span class="post-tag" onclick="filterByTrend('${tag}')">#${tag}</span>`).join('')}
        </div>
    `;
}

function createPredictionCard(post) {
    if (!post.prediction) return '';
    
    const directionClass = post.prediction ? post.prediction.toLowerCase() : 'neutral';
    const directionIcon = getDirectionIcon(post.prediction);
    
    return `
        <div class="prediction-card-mini">
            <div class="prediction-header-mini">
                <div class="asset-info">
                    <span class="asset-name">${post.cryptoSymbol}</span>
                    <span class="prediction-direction ${directionClass}">
                        <i class="fas fa-${directionIcon}"></i>
                        ${post.prediction}
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


function toggleLike(postId) {
    const post = communityData.toggleLike(postId, currentUser.id);
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
    const post = communityData.posts.find(p => p.id === postId);
    
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
    
    communityData.addComment(currentPostId, comment);
    
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
    const postType = document.getElementById('postType').value;
    const quickAsset = document.getElementById('quickAsset').value;
    const quickDirection = document.getElementById('quickDirection').value;
    const quickConfidence = document.getElementById('quickConfidence').value;
    
    if (!content) return;
    
    // Create post data
    let postData = {
        userId: currentUser.id,
        userName: currentUser.displayName,
        userBadge: currentUser.badge || 'trader',
        content: content,
        postType: postType,
        cryptoSymbol: quickAsset || communityData.currentCrypto === 'ALL' ? 'BTC' : communityData.currentCrypto,
        tags: extractHashtags(content)
    };
    
    // Add prediction data if available
    if (quickDirection && quickConfidence) {
        postData.prediction = quickDirection;
        postData.confidence = parseInt(quickConfidence);
    }
    
    // Store post
    communityData.addPost(postData);
    
    // Update crypto counts
    updateCryptoPostCounts();
    
    // Hide modal and reload feed
    hidePostModal();
    loadCommunityFeed();
    
    // Show success message
    showAlert('Post shared successfully! 🎉', 'success');
}

// Extract hashtags from content
function extractHashtags(content) {
    const hashtagRegex = /#[\w]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
}

// Update post form based on type
function updatePostForm() {
    const postType = document.getElementById('postType').value;
    const contentLabel = document.getElementById('contentLabel');
    const postContent = document.getElementById('postContent');
    
    const labels = {
        tweet: 'What\'s on your mind?',
        prediction: 'Share your price prediction',
        analysis: 'Share your technical analysis',
        discussion: 'Start a discussion topic',
        news: 'Share news and updates'
    };
    
    const placeholders = {
        tweet: 'Share your thoughts with the community...',
        prediction: 'I predict that [CRYPTO] will [DIRECTION] because...',
        analysis: 'Looking at the charts, I see...',
        discussion: 'What do you think about...',
        news: 'Breaking: [NEWS HEADLINE]...'
    };
    
    contentLabel.textContent = labels[postType] || labels.tweet;
    postContent.placeholder = placeholders[postType] || placeholders.tweet;
}

function sharePost(postId) {
    console.log('Share button clicked for post:', postId);
    
    const post = communityData.posts.find(p => p.id === postId);
    if (!post) {
        console.error('Post not found:', postId);
        showAlert('Post not found!', 'danger');
        return;
    }
    
    console.log('Found post:', post);
    
    const shareText = `Check out this ${post.cryptoSymbol} ${post.postType} on TradeLens: "${post.content.substring(0, 100)}..." - ${post.userName}`;
    
    console.log('Share text:', shareText);
    
    // Always use fallback for now to ensure it works
    fallbackShare(shareText);
}

function fallbackShare(text) {
    console.log('Fallback share called with text:', text);
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Successfully copied to clipboard');
            showAlert('Post link copied to clipboard!', 'success');
        }).catch((error) => {
            console.error('Clipboard write failed:', error);
            // Try alternative method
            tryLegacyCopy(text);
        });
    } else {
        console.log('Clipboard API not available, trying legacy method');
        tryLegacyCopy(text);
    }
}

function tryLegacyCopy(text) {
    try {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
            console.log('Legacy copy successful');
            showAlert('Post link copied to clipboard!', 'success');
        } else {
            console.log('Legacy copy failed');
            showAlert('Unable to copy - please manually copy the text', 'warning');
        }
    } catch (error) {
        console.error('Legacy copy error:', error);
        showAlert('Sharing feature temporarily unavailable', 'warning');
    }
}

function viewPredictionDetails(postId) {
    const post = communityData.posts.find(p => p.id === postId);
    if (!post) return;
    
    // Show detailed prediction analysis
    showAlert(`Prediction: ${post.cryptoSymbol} ${post.prediction} with ${post.confidence}% confidence`, 'info');
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
