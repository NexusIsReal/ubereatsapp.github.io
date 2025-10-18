// Telegram Mini App JavaScript
class UberEatsMiniApp {
    constructor() {
        this.telegram = window.Telegram?.WebApp;
        this.recentCarts = this.loadRecentCarts();
        this.init();
    }

    init() {
        this.setupTelegramWebApp();
        this.setupEventListeners();
        this.renderRecentCarts();
        this.setupFormValidation();
    }

    setupTelegramWebApp() {
        if (this.telegram) {
            // Configure Telegram WebApp
            this.telegram.ready();
            this.telegram.expand();
            
            // Set theme colors to match our design
            this.telegram.setHeaderColor('#8B5CF6');
            this.telegram.setBackgroundColor('#8B5CF6');
            
            // Enable closing confirmation
            this.telegram.enableClosingConfirmation();
            
            // Set main button
            this.telegram.MainButton.setText('Start Automation');
            this.telegram.MainButton.color = '#F59E0B';
            this.telegram.MainButton.textColor = '#ffffff';
            
            console.log('Telegram WebApp initialized');
        } else {
            console.log('Running in browser mode (not in Telegram)');
        }
    }

    setupEventListeners() {
        // Form submission
        const cartForm = document.getElementById('cartForm');
        cartForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // URL input validation
        const cartUrlInput = document.getElementById('cartUrl');
        cartUrlInput.addEventListener('input', (e) => this.validateUrl(e.target.value));
        cartUrlInput.addEventListener('paste', (e) => this.handlePaste(e));


        // Telegram main button
        if (this.telegram) {
            this.telegram.MainButton.onClick(() => {
                this.handleFormSubmit(new Event('submit'));
            });
        }
    }

    setupFormValidation() {
        const cartUrlInput = document.getElementById('cartUrl');
        const primaryBtn = document.querySelector('.primary-btn');
        
        cartUrlInput.addEventListener('input', () => {
            const isValid = this.isValidUberEatsUrl(cartUrlInput.value);
            primaryBtn.disabled = !isValid;
            
            if (this.telegram) {
                if (isValid) {
                    this.telegram.MainButton.show();
                } else {
                    this.telegram.MainButton.hide();
                }
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const cartUrl = document.getElementById('cartUrl').value.trim();
        
        if (!this.isValidUberEatsUrl(cartUrl)) {
            this.showError('Please enter a valid Uber Eats group cart URL');
            return;
        }

        this.processCart(cartUrl);
    }

    async processCart(cartUrl) {
        try {
            this.showLoading();
            this.updateLoadingStep(1, 'Connecting to Uber Eats...');
            
            // Simulate processing steps
            await this.delay(1000);
            this.updateLoadingStep(2, 'Applying promo code...');
            
            await this.delay(1500);
            this.updateLoadingStep(3, 'Processing payment...');
            
            await this.delay(2000);
            this.updateLoadingStep(4, 'Order completed successfully!');
            
            // Save to recent carts
            this.addToRecentCarts(cartUrl);
            
            await this.delay(1000);
            this.hideLoading();
            this.showSuccess('Order processed successfully!');
            
            // Clear form
            document.getElementById('cartUrl').value = '';
            
            // Send data to backend (when implemented)
            await this.sendToBackend(cartUrl);
            
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to process order. Please try again.');
            console.error('Error processing cart:', error);
        }
    }

    async sendToBackend(cartUrl) {
        // This will be implemented when backend is ready
        const payload = {
            cartUrl: cartUrl,
            timestamp: new Date().toISOString()
        };

        console.log('Sending to backend:', payload);
        
        // For now, just simulate API call
        try {
            // const response = await fetch('/api/process-cart', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });
            // 
            // if (!response.ok) {
            //     throw new Error('Backend processing failed');
            // }
            
            console.log('Backend processing simulated successfully');
        } catch (error) {
            console.error('Backend error:', error);
            throw error;
        }
    }

    isValidUberEatsUrl(url) {
        const uberEatsPattern = /^https?:\/\/(www\.)?ubereats\.com\/group\/[a-zA-Z0-9_-]+/;
        return uberEatsPattern.test(url);
    }

    validateUrl(url) {
        const isValid = this.isValidUberEatsUrl(url);
        const input = document.getElementById('cartUrl');
        
        if (url && !isValid) {
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '';
        }
        
        return isValid;
    }

    handlePaste(e) {
        setTimeout(() => {
            const pastedText = e.target.value;
            if (this.isValidUberEatsUrl(pastedText)) {
                this.showSuccess('Valid Uber Eats URL detected!');
            }
        }, 100);
    }

    async pasteFromClipboard() {
        try {
            if (navigator.clipboard && navigator.clipboard.readText) {
                const text = await navigator.clipboard.readText();
                const cartUrlInput = document.getElementById('cartUrl');
                cartUrlInput.value = text;
                cartUrlInput.focus();
                
                if (this.isValidUberEatsUrl(text)) {
                    this.showSuccess('URL pasted successfully!');
                } else {
                    this.showError('Invalid Uber Eats URL in clipboard');
                }
            } else {
                this.showError('Clipboard access not available');
            }
        } catch (error) {
            console.error('Clipboard error:', error);
            this.showError('Failed to access clipboard');
        }
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('hidden');
        
        // Reset all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Activate first step
        document.getElementById('step1').classList.add('active');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.add('hidden');
    }

    updateLoadingStep(stepNumber, text) {
        const loadingText = document.getElementById('loadingText');
        loadingText.textContent = text;
        
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index < stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    showSuccess(message) {
        const toast = document.getElementById('successToast');
        const messageElement = toast.querySelector('.toast-message');
        messageElement.textContent = message;
        
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    showError(message) {
        const toast = document.getElementById('errorToast');
        const messageElement = toast.querySelector('.toast-message');
        messageElement.textContent = message;
        
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    showHelp() {
        const modal = document.getElementById('helpModal');
        modal.classList.remove('hidden');
    }

    hideHelp() {
        const modal = document.getElementById('helpModal');
        modal.classList.add('hidden');
    }

    showAbout() {
        this.showSuccess('I\'m Hungry v1.0 - Automate your group orders!');
    }

    showSupport() {
        this.showSuccess('Need help? Contact support at support@imhungry.com');
    }

    // Recent Carts Management
    loadRecentCarts() {
        try {
            const saved = localStorage.getItem('uberEatsRecentCarts');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading recent carts:', error);
            return [];
        }
    }

    saveRecentCarts() {
        try {
            localStorage.setItem('uberEatsRecentCarts', JSON.stringify(this.recentCarts));
        } catch (error) {
            console.error('Error saving recent carts:', error);
        }
    }

    addToRecentCarts(cartUrl) {
        const cartData = {
            url: cartUrl,
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        };

        // Remove if already exists
        this.recentCarts = this.recentCarts.filter(cart => cart.url !== cartUrl);
        
        // Add to beginning
        this.recentCarts.unshift(cartData);
        
        // Keep only last 10
        this.recentCarts = this.recentCarts.slice(0, 10);
        
        this.saveRecentCarts();
        this.renderRecentCarts();
    }

    renderRecentCarts() {
        const container = document.getElementById('recentCarts');
        
        if (this.recentCarts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <p>No recent carts yet</p>
                    <small>Your processed carts will appear here</small>
                </div>
            `;
            return;
        }

        container.innerHTML = this.recentCarts.map(cart => `
            <div class="recent-cart-item" onclick="app.useRecentCart('${cart.url}')">
                <div class="cart-info">
                    <div class="cart-url">${this.truncateUrl(cart.url)}</div>
                    <div class="cart-time">${this.formatTime(cart.timestamp)}</div>
                </div>
                <div class="cart-action">
                    <span class="action-icon">↗️</span>
                </div>
            </div>
        `).join('');
    }

    useRecentCart(cartUrl) {
        document.getElementById('cartUrl').value = cartUrl;
        document.getElementById('cartUrl').focus();
        this.showSuccess('Recent cart URL loaded!');
    }

    clearRecent() {
        this.recentCarts = [];
        this.saveRecentCarts();
        this.renderRecentCarts();
        this.showSuccess('Recent carts cleared!');
    }

    truncateUrl(url) {
        if (url.length > 50) {
            return url.substring(0, 47) + '...';
        }
        return url;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Less than 1 minute
            return 'Just now';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes}m ago`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `${hours}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    }


    // Utility functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Telegram-specific methods
    sendDataToTelegram(data) {
        if (this.telegram) {
            this.telegram.sendData(JSON.stringify(data));
        }
    }

    closeTelegramApp() {
        if (this.telegram) {
            this.telegram.close();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new UberEatsMiniApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden
    }
});

// Handle beforeunload
window.addEventListener('beforeunload', () => {
    // App cleanup
});

// Export for global access
window.UberEatsMiniApp = UberEatsMiniApp;
