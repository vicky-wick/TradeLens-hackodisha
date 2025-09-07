// Firebase Authentication Integration for TradeLens
// This file provides Firebase auth integration with existing localStorage system

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeDbDt_qj1vPAwxJNjdHNQ4wVHWStXd5c",
    authDomain: "tradelens-ho5.firebaseapp.com",
    projectId: "tradelens-ho5",
    storageBucket: "tradelens-ho5.firebasestorage.app",
    messagingSenderId: "549096774863",
    appId: "1:549096774863:web:d32a5ada8d3706b6f6abba"
};

// Global Firebase auth instance (will be initialized when needed)
let firebaseAuth = null;

// Initialize Firebase Auth (lazy loading)
async function initFirebaseAuth() {
    if (firebaseAuth) return firebaseAuth;
    
    try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js");
        const { getAuth, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js");
        
        const app = initializeApp(firebaseConfig);
        firebaseAuth = getAuth(app);
        
        // Listen for auth state changes
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                // User is signed in, sync with localStorage
                syncFirebaseUserToStorage(user);
            } else {
                // User is signed out, check if we should redirect
                const currentPath = window.location.pathname;
                const protectedPaths = ['/pages/dashboard.html', '/pages/learning.html'];
                
                if (protectedPaths.some(path => currentPath.includes(path))) {
                    // Redirect to login if on protected page
                    const currentPage = currentPath.split('/').pop();
                    window.location.href = `login.html?redirect=${currentPage}`;
                }
            }
        });
        
        return firebaseAuth;
    } catch (error) {
        console.error('Failed to initialize Firebase Auth:', error);
        return null;
    }
}

// Sync Firebase user data with localStorage (compatible with existing system)
function syncFirebaseUserToStorage(user) {
    const userData = {
        id: user.uid,
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL,
        joinedAt: new Date().toISOString(),
        traderHealthScore: 50,
        level: 1,
        experience: 0,
        achievements: [],
        firebaseUser: true,
        lastLogin: new Date().toISOString()
    };
    
    // Check if user data already exists and merge
    const existingData = TradeLensStorage.getStoredUser();
    if (existingData && existingData.id === user.uid) {
        // Merge existing data with Firebase user data
        Object.assign(userData, existingData, {
            displayName: user.displayName || existingData.displayName || user.email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL || existingData.photoURL,
            firebaseUser: true,
            lastLogin: new Date().toISOString()
        });
    }
    
    localStorage.setItem('tradeLensUser', JSON.stringify(userData));
    
    // Update UI if userName element exists
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userData.displayName;
    }
    
    // Show/hide login/logout buttons based on auth state
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    
    return userData;
}

// Enhanced logout function that handles Firebase auth
async function firebaseLogout() {
    try {
        const auth = await initFirebaseAuth();
        if (auth && auth.currentUser) {
            const { signOut } = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js");
            await signOut(auth);
        }
    } catch (error) {
        console.error('Firebase logout error:', error);
    }
    
    // Clear localStorage
    localStorage.removeItem('tradeLensUser');
    
    // Redirect to home
    window.location.href = '../index.html';
}

// Check authentication status
async function checkAuthStatus() {
    const auth = await initFirebaseAuth();
    if (!auth) {
        // Fallback to localStorage check
        return TradeLensStorage.getStoredUser();
    }
    
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            if (user) {
                resolve(syncFirebaseUserToStorage(user));
            } else {
                resolve(null);
            }
        });
    });
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize Firebase Auth
    await initFirebaseAuth();
    
    // Check if user is authenticated
    const user = await checkAuthStatus();
    
    // Show/hide buttons based on auth state
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (user) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
    
    // Update logout buttons to use Firebase logout
    const logoutButtons = document.querySelectorAll('[onclick*="logout"]');
    logoutButtons.forEach(button => {
        button.onclick = firebaseLogout;
    });
});

// Make functions available globally
window.firebaseLogout = firebaseLogout;
window.checkAuthStatus = checkAuthStatus;
window.initFirebaseAuth = initFirebaseAuth;
