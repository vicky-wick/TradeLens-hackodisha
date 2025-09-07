// TradeLens Local Storage Management

// Storage keys
const STORAGE_KEYS = {
    USER: 'tradelens_user',
    PREDICTIONS: 'tradelens_predictions',
    LESSONS: 'tradelens_lessons',
    COMMUNITY_POSTS: 'tradelens_posts',
    SETTINGS: 'tradelens_settings'
};

// User Management
function storeUser(userData) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
}

function getStoredUser() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
}

function updateUser(updates) {
    const currentUser = getStoredUser();
    if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        storeUser(updatedUser);
        return updatedUser;
    }
    return null;
}

function clearUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
}

// Predictions Management
function storePrediction(prediction) {
    const predictions = getStoredPredictions();
    prediction.id = generateId();
    prediction.createdAt = new Date().toISOString();
    predictions.push(prediction);
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(predictions));
    return prediction;
}

function getStoredPredictions() {
    const predictions = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
    return predictions ? JSON.parse(predictions) : [];
}

function getUserPredictions(userId) {
    const predictions = getStoredPredictions();
    return predictions.filter(p => p.userId === userId);
}

function updatePrediction(predictionId, updates) {
    const predictions = getStoredPredictions();
    const index = predictions.findIndex(p => p.id === predictionId);
    if (index !== -1) {
        predictions[index] = { ...predictions[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(predictions));
        return predictions[index];
    }
    return null;
}

// Lessons Management
function storeLessonProgress(userId, lessonId, progress) {
    const lessons = getStoredLessons();
    const existingIndex = lessons.findIndex(l => l.userId === userId && l.lessonId === lessonId);
    
    const lessonProgress = {
        id: existingIndex !== -1 ? lessons[existingIndex].id : generateId(),
        userId,
        lessonId,
        ...progress,
        updatedAt: new Date().toISOString()
    };
    
    if (existingIndex !== -1) {
        lessons[existingIndex] = lessonProgress;
    } else {
        lessons.push(lessonProgress);
    }
    
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    return lessonProgress;
}

function getStoredLessons() {
    const lessons = localStorage.getItem(STORAGE_KEYS.LESSONS);
    return lessons ? JSON.parse(lessons) : [];
}

function getUserLessonProgress(userId) {
    const lessons = getStoredLessons();
    return lessons.filter(l => l.userId === userId);
}

// Community Posts Management
function storeCommunityPost(post) {
    const posts = getStoredCommunityPosts();
    post.id = generateId();
    post.createdAt = new Date().toISOString();
    post.likes = 0;
    post.comments = [];
    posts.unshift(post); // Add to beginning for chronological order
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    return post;
}

function getStoredCommunityPosts() {
    const posts = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    return posts ? JSON.parse(posts) : [];
}

function likeCommunityPost(postId, userId) {
    const posts = getStoredCommunityPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
        if (!post.likedBy) post.likedBy = [];
        if (!post.likedBy.includes(userId)) {
            post.likedBy.push(userId);
            post.likes = (post.likes || 0) + 1;
            localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
        }
    }
    return post;
}

function addCommentToPost(postId, comment) {
    const posts = getStoredCommunityPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
        if (!post.comments) post.comments = [];
        comment.id = generateId();
        comment.createdAt = new Date().toISOString();
        post.comments.push(comment);
        localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    }
    return post;
}

// Settings Management
function storeSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function getStoredSettings() {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : getDefaultSettings();
}

function getDefaultSettings() {
    return {
        theme: 'light',
        notifications: true,
        riskTolerance: 'medium',
        defaultTimeframe: '1h',
        autoSavePredictions: true
    };
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}

function exportUserData() {
    const userData = {
        user: getStoredUser(),
        predictions: getStoredPredictions(),
        lessons: getStoredLessons(),
        posts: getStoredCommunityPosts(),
        settings: getStoredSettings()
    };
    return JSON.stringify(userData, null, 2);
}

function importUserData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        if (data.user) storeUser(data.user);
        if (data.predictions) localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(data.predictions));
        if (data.lessons) localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(data.lessons));
        if (data.posts) localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(data.posts));
        if (data.settings) storeSettings(data.settings);
        return true;
    } catch (error) {
        console.error('Failed to import data:', error);
        return false;
    }
}

// Initialize with sample data if none exists
function initializeSampleData() {
    // Add sample community posts if none exist
    if (getStoredCommunityPosts().length === 0) {
        const samplePosts = [
            {
                userId: 'sample_user_1',
                userName: 'CryptoTrader_Pro',
                content: 'Just completed the RSI lesson! The AI mentor helped me understand why my BTC prediction was off. The SHAP explanation showed volume was more important than I thought. 📈',
                predictionId: 'sample_pred_1',
                asset: 'BTC',
                prediction: 'UP',
                confidence: 75,
                likes: 12,
                comments: [
                    {
                        userId: 'sample_user_2',
                        userName: 'LearningTrader',
                        content: 'Great insight! I had the same realization about volume indicators.',
                        createdAt: new Date(Date.now() - 3600000).toISOString()
                    }
                ]
            },
            {
                userId: 'sample_user_2',
                userName: 'LearningTrader',
                content: 'My Trader Health Score improved from 45 to 62 after following the AI mentor\'s risk management tips! 🎯',
                likes: 8,
                comments: []
            },
            {
                userId: 'sample_user_3',
                userName: 'AIStudent',
                content: 'The ML mentor predicted DOWN while I predicted UP for ETH. Turns out the RSI divergence I missed was crucial. Learning so much! 🤖',
                predictionId: 'sample_pred_2',
                asset: 'ETH',
                prediction: 'UP',
                confidence: 60,
                likes: 15,
                comments: []
            }
        ];
        
        samplePosts.forEach(post => {
            post.id = generateId();
            post.createdAt = new Date(Date.now() - Math.random() * 86400000).toISOString();
        });
        
        localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(samplePosts));
    }
}

// Initialize sample data when storage.js loads
initializeSampleData();

// Export functions for global use
window.TradeLensStorage = {
    // User functions
    storeUser,
    getStoredUser,
    updateUser,
    clearUser,
    
    // Prediction functions
    storePrediction,
    getStoredPredictions,
    getUserPredictions,
    updatePrediction,
    
    // Lesson functions
    storeLessonProgress,
    getStoredLessons,
    getUserLessonProgress,
    
    // Community functions
    storeCommunityPost,
    getStoredCommunityPosts,
    likeCommunityPost,
    addCommentToPost,
    
    // Settings functions
    storeSettings,
    getStoredSettings,
    
    // Utility functions
    clearAllData,
    exportUserData,
    importUserData,
    generateId
};
