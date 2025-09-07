// BONNEY Floating Chatbot Widget JavaScript

class BonneyWidget {
    constructor() {
        this.isOpen = false;
        this.widget = null;
        this.button = null;
        this.chat = null;
        this.iframe = null;
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        this.addPulseEffect();
    }

    createWidget() {
        // Create the main widget container
        this.widget = document.createElement('div');
        this.widget.id = 'bonney-widget';
        
        // Create the widget HTML structure
        this.widget.innerHTML = `
            <button id="bonney-btn" aria-label="Chat with BONNEY">
                BONNEY
            </button>
            <div id="bonney-chat">
                <div id="bonney-header">
                    <span>💬 BONNEY Assistant</span>
                    <button id="bonney-close" aria-label="Close chat">✖</button>
                </div>
                <div id="bonney-content">
                    <div class="bonney-loading" id="bonney-loading">
                        <div class="bonney-spinner"></div>
                        <div>Loading BONNEY...</div>
                    </div>
                    <iframe 
                        id="bonney-iframe"
                        src="https://go-chatbot-production.up.railway.app/"
                        title="BONNEY Chatbot"
                        style="display: none;">
                    </iframe>
                </div>
            </div>
        `;

        // Append to body
        document.body.appendChild(this.widget);

        // Get references to elements
        this.button = document.getElementById('bonney-btn');
        this.chat = document.getElementById('bonney-chat');
        this.iframe = document.getElementById('bonney-iframe');
        this.closeBtn = document.getElementById('bonney-close');
        this.loading = document.getElementById('bonney-loading');
    }

    attachEventListeners() {
        // Open chat on button click
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleChat();
        });

        // Close chat on close button click
        this.closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeChat();
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.widget.contains(e.target)) {
                this.closeChat();
            }
        });

        // Handle iframe load
        this.iframe.addEventListener('load', () => {
            this.hideLoading();
        });

        // Handle iframe error
        this.iframe.addEventListener('error', () => {
            this.showError();
        });

        // Keyboard accessibility
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleChat();
            }
        });

        this.closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.closeChat();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.chat.style.display = 'flex';
        
        // Trigger animation
        setTimeout(() => {
            this.chat.classList.add('active');
        }, 10);

        // Load iframe if not already loaded
        if (!this.iframe.src || this.iframe.src === 'about:blank') {
            this.iframe.src = 'https://go-chatbot-production.up.railway.app/';
            this.iframe.style.display = 'none';
            this.loading.style.display = 'block';
        }

        // Remove pulse effect when opened
        this.button.classList.remove('pulse');

        // Focus management for accessibility
        this.closeBtn.focus();
    }

    closeChat() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.chat.classList.remove('active');
        
        // Hide after animation completes
        setTimeout(() => {
            if (!this.isOpen) {
                this.chat.style.display = 'none';
            }
        }, 300);

        // Return focus to button
        this.button.focus();
    }

    hideLoading() {
        if (this.loading) {
            this.loading.style.display = 'none';
        }
        if (this.iframe) {
            this.iframe.style.display = 'block';
        }
    }

    showError() {
        if (this.loading) {
            this.loading.innerHTML = `
                <div style="color: #ff6b6b; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
                    <div>Failed to load BONNEY</div>
                    <div style="margin-top: 10px;">
                        <a href="https://go-chatbot-production.up.railway.app/" 
                           target="_blank" 
                           style="color: #00d4ff; text-decoration: none;">
                            Open in new tab
                        </a>
                    </div>
                </div>
            `;
        }
    }

    addPulseEffect() {
        // Add subtle pulse effect to attract attention
        setTimeout(() => {
            if (!this.isOpen) {
                this.button.classList.add('pulse');
            }
        }, 3000);

        // Remove pulse after user interaction
        this.button.addEventListener('mouseenter', () => {
            this.button.classList.remove('pulse');
        });
    }

    // Public method to programmatically open/close
    open() {
        this.openChat();
    }

    close() {
        this.closeChat();
    }

    // Method to check if chat is open
    isOpened() {
        return this.isOpen;
    }
}

// Initialize BONNEY widget when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're not on a page that should exclude the widget
    const excludePages = []; // Add any pages to exclude if needed
    const currentPage = window.location.pathname;
    
    const shouldExclude = excludePages.some(page => currentPage.includes(page));
    
    if (!shouldExclude) {
        window.bonneyWidget = new BonneyWidget();
    }
});

// Make it available globally for debugging/external control
window.BonneyWidget = BonneyWidget;
