// Enhanced User Management with Azure Database Integration
class UserManager {
    constructor() {
        this.apiBaseUrl = 'https://messad-estudio-api.azurewebsites.net/api'; // Your Azure Functions endpoint
        this.currentUser = null;
        this.init();
    }

    async init() {
        console.log('UserManager initializing...');
        // Check if user is already authenticated
        if (window.authManager && window.authManager.isLoggedIn()) {
            await this.loadUserProfile();
        }
    }

    // Register new user in Azure database
    async registerUser(authData) {
        console.log('Registering new user:', authData);
        
        const userData = {
            azureId: authData.localAccountId,
            email: authData.username,
            name: authData.name,
            provider: authData.idTokenClaims?.iss?.includes('google') ? 'google' : 'microsoft',
            registrationDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profileData: {
                firstName: authData.idTokenClaims?.given_name || '',
                lastName: authData.idTokenClaims?.family_name || '',
                picture: authData.idTokenClaims?.picture || '',
                locale: authData.idTokenClaims?.locale || 'es-ES'
            }
        };

        try {
            const response = await this.makeAPICall('/users/register', 'POST', userData);
            
            if (response.success) {
                this.currentUser = response.user;
                this.saveUserSession();
                this.showWelcomeMessage(true); // true = new user
                return response.user;
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Load existing user profile from Azure database
    async loadUserProfile() {
        const authData = window.authManager.getUserInfo();
        if (!authData) return null;

        try {
            const response = await this.makeAPICall(`/users/profile/${authData.id}`, 'GET');
            
            if (response.success) {
                this.currentUser = response.user;
                this.saveUserSession();
                await this.updateLastLogin();
                this.showWelcomeMessage(false); // false = returning user
                return this.currentUser;
            } else if (response.status === 404) {
                // User doesn't exist in database, register them
                const account = window.authManager.currentAccount;
                return await this.registerUser(account);
            } else {
                throw new Error(response.message || 'Failed to load user profile');
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            // If user doesn't exist, register them
            if (error.message.includes('404') || error.message.includes('not found')) {
                const account = window.authManager.currentAccount;
                return await this.registerUser(account);
            }
            throw error;
        }
    }

    // Update user's last login timestamp
    async updateLastLogin() {
        if (!this.currentUser) return;

        try {
            await this.makeAPICall(`/users/${this.currentUser.id}/login`, 'POST', {
                lastLogin: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating last login:', error);
            // Non-critical error, don't throw
        }
    }

    // Update user profile
    async updateProfile(profileData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const response = await this.makeAPICall(`/users/${this.currentUser.id}/profile`, 'PUT', profileData);
            
            if (response.success) {
                this.currentUser = { ...this.currentUser, ...response.user };
                this.saveUserSession();
                return this.currentUser;
            } else {
                throw new Error(response.message || 'Profile update failed');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    }

    // Save user session to localStorage
    saveUserSession() {
        if (this.currentUser) {
            localStorage.setItem('messad_user_session', JSON.stringify({
                user: this.currentUser,
                timestamp: Date.now()
            }));
        }
    }

    // Load user session from localStorage
    loadUserSession() {
        try {
            const session = localStorage.getItem('messad_user_session');
            if (session) {
                const data = JSON.parse(session);
                // Check if session is less than 24 hours old
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    this.currentUser = data.user;
                    return this.currentUser;
                }
            }
        } catch (error) {
            console.error('Error loading user session:', error);
        }
        return null;
    }

    // Clear user session
    clearUserSession() {
        this.currentUser = null;
        localStorage.removeItem('messad_user_session');
    }

    // Make API calls with authentication
    async makeAPICall(endpoint, method = 'GET', data = null) {
        const url = `${this.apiBaseUrl}${endpoint}`;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        // Add authentication token if available
        if (window.authManager && window.authManager.isLoggedIn()) {
            try {
                const token = await window.authManager.getToken();
                options.headers['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.warn('Could not get access token:', error);
            }
        }

        // Add request body for POST/PUT requests
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`Making API call: ${method} ${url}`);
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('API response:', result);
            return result;
        } catch (error) {
            console.error('API call failed:', error);
            
            // For development - simulate responses
            if (this.isDevelopmentMode()) {
                return this.simulateAPIResponse(endpoint, method, data);
            }
            
            throw error;
        }
    }

    // Development mode simulation (remove in production)
    isDevelopmentMode() {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    }

    simulateAPIResponse(endpoint, method, data) {
        console.log('🧪 DEVELOPMENT MODE: Simulating API response');
        
        // Simulate user registration
        if (endpoint === '/users/register' && method === 'POST') {
            const user = {
                id: 'dev_' + Math.random().toString(36).substr(2, 9),
                azureId: data.azureId,
                email: data.email,
                name: data.name,
                provider: data.provider,
                registrationDate: data.registrationDate,
                lastLogin: data.lastLogin,
                profileData: data.profileData,
                preferences: {
                    language: 'es',
                    notifications: true,
                    theme: 'light'
                }
            };
            
            return {
                success: true,
                user: user,
                message: 'User registered successfully (simulated)'
            };
        }

        // Simulate user profile load
        if (endpoint.includes('/users/profile/') && method === 'GET') {
            // Return 404 for first-time users to trigger registration
            return {
                success: false,
                status: 404,
                message: 'User not found'
            };
        }

        // Default success response
        return {
            success: true,
            message: 'Simulated response',
            data: data
        };
    }

    // Show welcome message to users
    showWelcomeMessage(isNewUser) {
        if (!this.currentUser) return;

        const message = isNewUser 
            ? `¡Bienvenido/a a Messad Estudio, ${this.currentUser.profileData?.firstName || this.currentUser.name}! Tu cuenta ha sido creada exitosamente.`
            : `¡Hola de nuevo, ${this.currentUser.profileData?.firstName || this.currentUser.name}!`;

        // Create a nice toast notification
        this.showToast(message, isNewUser ? 'success' : 'info');
    }

    // Show toast notifications
    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToast = document.getElementById('userToast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.id = 'userToast';
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add toast styles if not already present
        if (!document.getElementById('toastStyles')) {
            const styles = document.createElement('style');
            styles.id = 'toastStyles';
            styles.textContent = `
                .toast-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    max-width: 350px;
                    animation: slideInRight 0.3s ease-out;
                }
                .toast-success { border-left: 4px solid #28a745; }
                .toast-info { border-left: 4px solid #17a2b8; }
                .toast-content {
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .toast-message {
                    flex: 1;
                    font-size: 14px;
                    color: #333;
                }
                .toast-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #999;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to page
        document.body.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    // Get current user data
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user has completed profile setup
    isProfileComplete() {
        if (!this.currentUser || !this.currentUser.profileData) return false;
        
        const required = ['firstName', 'lastName'];
        return required.every(field => this.currentUser.profileData[field]);
    }

    // Logout and clear user data
    async logout() {
        this.clearUserSession();
        if (window.authManager) {
            await window.authManager.logout();
        }
    }
}

// Initialize user manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing UserManager');
    window.userManager = new UserManager();
});

// Export for use in other files
window.UserManager = UserManager;
