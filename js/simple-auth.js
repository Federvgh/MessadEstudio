// Simple Authentication System with Google Sign-In and Email/Password Registration
class SimpleAuthManager {
    constructor() {
        this.currentUser = null;
        this.apiBaseUrl = 'https://your-backend-api.com/api'; // You'll replace this with your backend
        this.init();
    }

    async init() {
        console.log('SimpleAuthManager initializing...');
        
        // Initialize Google Sign-In
        await this.initializeGoogleSignIn();
        
        // Check for existing session
        this.loadUserSession();
        this.updateUI();
        
        console.log('SimpleAuthManager initialization complete');
    }

    async initializeGoogleSignIn() {
        try {
            // Load Google Sign-In library
            if (!window.google) {
                await this.loadGoogleScript();
            }
            
            // Initialize Google Sign-In
            await window.google.accounts.id.initialize({
                client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // You'll need to get this
                callback: (response) => this.handleGoogleSignIn(response),
                auto_select: false,
                cancel_on_tap_outside: true
            });
            
            console.log('Google Sign-In initialized successfully');
        } catch (error) {
            console.error('Error initializing Google Sign-In:', error);
            // Continue without Google Sign-In if it fails
        }
    }

    loadGoogleScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async handleGoogleSignIn(response) {
        try {
            console.log('Google Sign-In response:', response);
            
            // Decode the JWT token to get user info
            const userInfo = this.decodeJWT(response.credential);
            console.log('Google user info:', userInfo);
            
            // Create user object
            const user = {
                id: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                provider: 'google',
                firstName: userInfo.given_name,
                lastName: userInfo.family_name
            };
            
            // Register or login the user
            await this.registerOrLoginUser(user);
            
        } catch (error) {
            console.error('Google Sign-In error:', error);
            this.showError('Error signing in with Google');
        }
    }

    // Simple JWT decoder (for Google tokens)
    decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT:', error);
            throw error;
        }
    }

    async emailPasswordLogin(email, password) {
        try {
            console.log('Attempting email/password login for:', email);
            
            // Call your backend API
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const userData = await response.json();
            await this.setCurrentUser(userData.user);
            
            return userData;
        } catch (error) {
            console.error('Email/password login error:', error);
            
            // For development - simulate login
            if (this.isDevelopmentMode()) {
                return this.simulateEmailLogin(email, password);
            }
            
            throw error;
        }
    }

    async emailPasswordRegister(email, password, name) {
        try {
            console.log('Attempting email/password registration for:', email);
            
            // Call your backend API
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    name,
                    provider: 'email'
                })
            });
            
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            
            const userData = await response.json();
            await this.setCurrentUser(userData.user);
            
            return userData;
        } catch (error) {
            console.error('Email/password registration error:', error);
            
            // For development - simulate registration
            if (this.isDevelopmentMode()) {
                return this.simulateEmailRegistration(email, password, name);
            }
            
            throw error;
        }
    }

    async registerOrLoginUser(user) {
        try {
            // Try to register/login the user
            const response = await fetch(`${this.apiBaseUrl}/users/google-auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });
            
            if (!response.ok) {
                throw new Error('User registration/login failed');
            }
            
            const userData = await response.json();
            await this.setCurrentUser(userData.user);
            
        } catch (error) {
            console.error('User registration/login error:', error);
            
            // For development - simulate user creation
            if (this.isDevelopmentMode()) {
                await this.setCurrentUser(user);
            } else {
                throw error;
            }
        }
    }

    async setCurrentUser(user) {
        this.currentUser = user;
        this.saveUserSession();
        this.updateUI();
        this.closeLoginModal();
        this.showWelcomeMessage();
    }

    // Development mode simulations
    isDevelopmentMode() {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    }

    simulateEmailLogin(email, password) {
        const user = {
            id: 'sim_' + Math.random().toString(36).substr(2, 9),
            email: email,
            name: email.split('@')[0],
            provider: 'email',
            firstName: email.split('@')[0],
            lastName: ''
        };
        
        setTimeout(() => this.setCurrentUser(user), 500);
        return Promise.resolve({ user });
    }

    simulateEmailRegistration(email, password, name) {
        const user = {
            id: 'sim_' + Math.random().toString(36).substr(2, 9),
            email: email,
            name: name,
            provider: 'email',
            firstName: name.split(' ')[0] || name,
            lastName: name.split(' ')[1] || ''
        };
        
        setTimeout(() => this.setCurrentUser(user), 500);
        return Promise.resolve({ user });
    }

    // Session management
    saveUserSession() {
        if (this.currentUser) {
            localStorage.setItem('messad_user_session', JSON.stringify({
                user: this.currentUser,
                timestamp: Date.now()
            }));
        }
    }

    loadUserSession() {
        try {
            const session = localStorage.getItem('messad_user_session');
            if (session) {
                const data = JSON.parse(session);
                // Check if session is less than 7 days old
                if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
                    this.currentUser = data.user;
                    console.log('User session loaded:', this.currentUser.email);
                    return this.currentUser;
                }
            }
        } catch (error) {
            console.error('Error loading user session:', error);
        }
        return null;
    }

    clearUserSession() {
        this.currentUser = null;
        localStorage.removeItem('messad_user_session');
    }

    // UI Management
    updateUI() {
        console.log('SimpleAuthManager: updateUI called');
        const loginBtn = document.getElementById('loginBtn');
        console.log('SimpleAuthManager: loginBtn found:', loginBtn);
        if (!loginBtn) {
            console.error('SimpleAuthManager: loginBtn not found!');
            return;
        }

        if (this.currentUser) {
            // User is logged in
            const displayName = this.currentUser.firstName || this.currentUser.name.split(' ')[0] || this.currentUser.name;
            loginBtn.innerHTML = `${displayName} <span class="ms-1">▾</span>`;
            loginBtn.onclick = (e) => {
                e.preventDefault();
                console.log('SimpleAuthManager: User menu clicked');
                this.showUserMenu();
            };
        } else {
            // User is not logged in
            loginBtn.innerHTML = 'Login';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                console.log('SimpleAuthManager: Login button clicked - showing modal');
                this.showLoginModal();
            };
        }
    }

    showLoginModal() {
        console.log('SimpleAuthManager: showLoginModal called');
        const loginModal = document.getElementById('loginModal');
        console.log('SimpleAuthManager: loginModal found:', loginModal);
        
        if (loginModal) {
            // Create backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.id = 'loginModalBackdrop';
            document.body.appendChild(backdrop);
            
            // Show modal with proper Bootstrap classes
            loginModal.style.display = 'block';
            loginModal.classList.add('show');
            loginModal.classList.add('d-block');
            document.body.classList.add('modal-open');
            
            // Ensure high z-index
            loginModal.style.zIndex = '99999';
            backdrop.style.zIndex = '99998';
            
            console.log('SimpleAuthManager: Modal should now be visible');
            console.log('Modal styles:', {
                display: loginModal.style.display,
                zIndex: loginModal.style.zIndex,
                classes: loginModal.classList.toString()
            });
            
            // Focus trap
            loginModal.focus();
        } else {
            console.error('SimpleAuthManager: loginModal not found!');
        }
    }

    closeLoginModal() {
        const loginModal = document.getElementById('loginModal');
        const backdrop = document.getElementById('loginModalBackdrop');
        
        if (loginModal) {
            loginModal.style.display = 'none';
            loginModal.classList.remove('show');
            loginModal.classList.remove('d-block');
            document.body.classList.remove('modal-open');
        }
        
        if (backdrop) {
            backdrop.remove();
        }
    }

    showUserMenu() {
        const options = [
            `👤 ${this.currentUser.name}`,
            `📧 ${this.currentUser.email}`,
            `🔗 Via ${this.currentUser.provider}`,
            '',
            '⚙️ Profile Settings',
            '🔓 Logout'
        ];
        
        const choice = prompt(
            `Usuario Autenticado:\n\n${options.slice(0, 4).join('\n')}\n\nSelecciona una opción:\n5. ${options[4]}\n6. ${options[5]}`,
            ''
        );
        
        if (choice === '6') {
            this.logout();
        }
    }

    async logout() {
        // Sign out from Google if applicable
        if (this.currentUser?.provider === 'google' && window.google) {
            try {
                window.google.accounts.id.disableAutoSelect();
            } catch (error) {
                console.log('Google sign-out error:', error);
            }
        }
        
        this.clearUserSession();
        this.updateUI();
        console.log('User logged out successfully');
    }

    showWelcomeMessage() {
        if (!this.currentUser) return;
        
        const message = `¡Bienvenido/a ${this.currentUser.firstName || this.currentUser.name}!`;
        this.showToast(message, 'success');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 350px;
            font-size: 14px;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    // Trigger Google Sign-In
    triggerGoogleSignIn() {
        if (window.google) {
            window.google.accounts.id.prompt();
        } else {
            this.showError('Google Sign-In no está disponible');
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Simple Authentication Manager');
    window.simpleAuthManager = new SimpleAuthManager();
});

window.SimpleAuthManager = SimpleAuthManager;
