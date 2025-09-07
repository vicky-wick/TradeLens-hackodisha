// TradeLens Main Application JavaScript

// Global state
let currentUser = null;
let currentPage = 'landing';

// Loader utility functions
function showIndexLoader() {
    const loader = document.getElementById('indexLoader');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

function hideIndexLoader() {
    const loader = document.getElementById('indexLoader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Show loader on page load
    showIndexLoader();
    
    // Simulate loading time
    setTimeout(() => {
        initializeApp();
        hideIndexLoader();
    }, 1000);
});

function initializeApp() {
    // Check if user is already logged in
    currentUser = getStoredUser();
    
    if (currentUser) {
        // Redirect to dashboard if logged in
        window.location.href = 'pages/dashboard.html';
    }
    
    // Add demo animation
    animateDemoSteps();
}

// Auth Modal Functions
function showAuth() {
    const modal = document.getElementById('authModal');
    modal.classList.add('show');
}

function hideAuth() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('show');
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        id: generateUserId(),
        displayName: formData.get('displayName') || event.target.querySelector('input[type="text"]').value,
        email: formData.get('email') || event.target.querySelector('input[type="email"]').value,
        password: formData.get('password') || event.target.querySelector('input[type="password"]').value,
        learningGoal: formData.get('learningGoal') || event.target.querySelector('select').value,
        joinedAt: new Date().toISOString(),
        traderHealthScore: 50,
        level: 1,
        badges: [],
        predictions: [],
        completedLessons: []
    };
    
    // Store user data
    storeUser(userData);
    currentUser = userData;
    
    // Show success and redirect
    showAlert('Account created successfully! Welcome to TradeLens!', 'success');
    setTimeout(() => {
        hideAuth();
        window.location.href = 'pages/dashboard.html';
    }, 1500);
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    // Simple login validation (in real app, this would be server-side)
    const storedUser = getStoredUser();
    if (storedUser && storedUser.email === email) {
        currentUser = storedUser;
        showAlert('Login successful! Welcome back!', 'success');
        setTimeout(() => {
            hideAuth();
            window.location.href = 'pages/dashboard.html';
        }, 1500);
    } else {
        showAlert('Invalid credentials. Please try again.', 'danger');
    }
}

function connectWallet() {
    // Simulate wallet connection
    showAlert('Wallet connection coming soon! Please use email signup for now.', 'info');
}

function showDemo() {
    // Scroll to demo section
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

// Utility Functions
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        ${message}
    `;
    
    // Add to page
    document.body.insertBefore(alert, document.body.firstChild);
    
    // Auto remove after 3 seconds
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

function animateDemoSteps() {
    const steps = document.querySelectorAll('.demo-card .step');
    let currentStep = 0;
    
    setInterval(() => {
        // Remove active class from all steps
        steps.forEach(step => step.classList.remove('active'));
        
        // Add active class to current step
        if (steps[currentStep]) {
            steps[currentStep].classList.add('active');
        }
        
        // Move to next step
        currentStep = (currentStep + 1) % steps.length;
    }, 2000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        hideAuth();
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Export functions for use in other files
window.TradeLens = {
    showAuth,
    hideAuth,
    showTab,
    handleSignup,
    handleLogin,
    connectWallet,
    showDemo,
    showAlert,
    getCurrentUser: () => currentUser
};
