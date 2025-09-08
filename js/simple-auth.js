// Simple Authentication System with Google Sign-In and Email/Password Registration
class SimpleAuthManager {
    constructor() {
        this.currentUser = null;
        this.apiBaseUrl = window.MessadConfig ? window.MessadConfig.getApiBaseUrl() : 'http://localhost:3001/api';
        this.authToken = localStorage.getItem('messad_auth_token');
        this.init();
    }

    async init() {
        console.log('SimpleAuthManager initializing...');
        
        // Initialize Google Sign-In
        await this.initializeGoogleSignIn();
        
        // Check for existing session and token
        await this.loadUserSession();
        this.updateUI();
        
        console.log('SimpleAuthManager initialization complete');
    }

    async initializeGoogleSignIn() {
        try {
            console.log('Initializing Google Sign-In...');
            
            // Load Google Sign-In library
            if (!window.google) {
                console.log('Loading Google Sign-In script...');
                await this.loadGoogleScript();
            }
            
            // Wait a bit for the script to fully load
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (!window.google || !window.google.accounts || !window.google.accounts.id) {
                throw new Error('Google Sign-In library not loaded properly');
            }
            
            // Initialize Google Sign-In with configuration
            const clientId = window.MessadConfig ? window.MessadConfig.googleClientId : 'YOUR_GOOGLE_CLIENT_ID_HERE';
            console.log('Configuring Google Sign-In with client ID:', clientId.substring(0, 20) + '...');
            
            if (clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
                console.warn('Google Client ID not configured. Please set googleClientId in config.js');
                return;
            }
            
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => this.handleGoogleSignIn(response),
                auto_select: false,
                cancel_on_tap_outside: false,
                itp_support: true,
                use_fedcm_for_prompt: false,
                ux_mode: 'popup', // Use popup mode instead of redirect
                context: 'signin'
            });
            
            // Render the Google button immediately
            this.renderGoogleButton();
            
            console.log('Google Sign-In initialized successfully');
        } catch (error) {
            console.error('Error initializing Google Sign-In:', error);
            this.showError('Error al inicializar Google Sign-In. Verifica la configuración.');
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
            
            // Send Google credential to backend
            const backendResponse = await fetch(`${this.apiBaseUrl}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    credential: response.credential 
                })
            });
            
            const data = await backendResponse.json();
            
            if (!backendResponse.ok) {
                throw new Error(data.message || 'Google authentication failed');
            }
            
            // Save auth token
            this.authToken = data.token;
            localStorage.setItem('messad_auth_token', data.token);
            
            await this.setCurrentUser(data.user);
            
        } catch (error) {
            console.error('Google Sign-In error:', error);
            this.showError('Error signing in with Google: ' + error.message);
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
            
            // Call backend API
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Save auth token
            this.authToken = data.token;
            localStorage.setItem('messad_auth_token', data.token);
            
            await this.setCurrentUser(data.user);
            return data;
            
        } catch (error) {
            console.error('Email/password login error:', error);
            throw error;
        }
    }

    async emailPasswordRegister(email, password, name) {
        try {
            console.log('Attempting email/password registration for:', email);
            
            // Call backend API
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    name
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            // Save auth token
            this.authToken = data.token;
            localStorage.setItem('messad_auth_token', data.token);
            
            await this.setCurrentUser(data.user);
            return data;
            
        } catch (error) {
            console.error('Email/password registration error:', error);
            throw error;
        }
    }

    renderGoogleButton() {
        try {
            // Create container for the Google button (make it visible for testing)
            let container = document.getElementById('google-signin-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'google-signin-container';
                container.style.position = 'fixed';
                container.style.top = '10px';
                container.style.right = '10px';
                container.style.zIndex = '10000';
                container.style.backgroundColor = 'white';
                container.style.padding = '10px';
                container.style.border = '1px solid #ccc';
                container.style.borderRadius = '5px';
                container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                document.body.appendChild(container);
                
                // Add a label
                const label = document.createElement('div');
                label.textContent = 'Direct Google Button (for testing):';
                label.style.fontSize = '12px';
                label.style.marginBottom = '5px';
                label.style.color = '#666';
                container.appendChild(label);
                
                // Create button container
                const buttonContainer = document.createElement('div');
                container.appendChild(buttonContainer);
                
                // Render the Google button
                window.google.accounts.id.renderButton(
                    buttonContainer,
                    {
                        theme: 'outline',
                        size: 'large',
                        type: 'standard',
                        text: 'signin_with',
                        shape: 'rectangular',
                        logo_alignment: 'left'
                    }
                );
                
                console.log('Google Sign-In button rendered (visible for testing)');
            }
        } catch (error) {
            console.error('Error rendering Google button:', error);
        }
    }

    // Trigger Google Sign-In
    triggerGoogleSignIn() {
        console.log('triggerGoogleSignIn called');
        
        if (!window.google || !window.google.accounts || !window.google.accounts.id) {
            console.error('Google Sign-In not available');
            this.showError('Google Sign-In no está disponible. Recarga la página e intenta nuevamente.');
            return;
        }
        
        try {
            console.log('Triggering Google Sign-In...');
            
            // Try the popup approach first (more reliable)
            const hiddenContainer = document.getElementById('google-signin-container');
            if (hiddenContainer) {
                const button = hiddenContainer.querySelector('div[role="button"]');
                if (button) {
                    console.log('Clicking Google Sign-In button');
                    button.click();
                    return;
                }
            }
            
            // Fallback to prompt method
            console.log('Using prompt method as fallback');
            window.google.accounts.id.prompt((notification) => {
                console.log('Google prompt notification:', notification);
                if (notification.isNotDisplayed()) {
                    const reason = notification.getNotDisplayedReason();
                    console.log('Prompt not displayed:', reason);
                    if (reason === 'invalid_client') {
                        this.showError('Error de configuración de Google. Por favor contacta al administrador.');
                    } else {
                        this.showError('Google Sign-In no disponible. Asegúrate de estar conectado a Google.');
                    }
                } else if (notification.isSkippedMoment()) {
                    this.showError('Inicio de sesión cancelado. Intenta nuevamente.');
                }
            });
        } catch (error) {
            console.error('Error triggering Google Sign-In:', error);
            this.showError('Error al iniciar Google Sign-In: ' + error.message);
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
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

    async loadUserSession() {
        try {
            // First check if we have a valid token
            if (this.authToken) {
                const isValid = await this.verifyToken();
                if (isValid) {
                    return this.currentUser;
                }
            }

            // Fallback to local session storage
            const session = localStorage.getItem('messad_user_session');
            if (session) {
                const data = JSON.parse(session);
                // Check if session is less than 1 day old (since we also verify with token)
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    this.currentUser = data.user;
                    console.log('User session loaded from storage:', this.currentUser.email);
                    return this.currentUser;
                }
            }
        } catch (error) {
            console.error('Error loading user session:', error);
            this.clearUserSession();
        }
        return null;
    }

    async setCurrentUser(user) {
        this.currentUser = user;
        this.saveUserSession();
        this.updateUI();
        this.closeLoginModal();
        this.showWelcomeMessage();
    }

    async verifyToken() {
        if (!this.authToken) return false;

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/verify-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: this.authToken })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.currentUser = data.user;
                this.saveUserSession();
                return true;
            } else {
                // Token is invalid, clear it
                this.clearUserSession();
                return false;
            }
        } catch (error) {
            console.error('Token verification error:', error);
            this.clearUserSession();
            return false;
        }
    }

    clearUserSession() {
        this.currentUser = null;
        this.authToken = null;
        localStorage.removeItem('messad_user_session');
        localStorage.removeItem('messad_auth_token');
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
        try {
            // Call backend logout endpoint
            if (this.authToken) {
                await fetch(`${this.apiBaseUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`,
                        'Content-Type': 'application/json',
                    }
                });
            }
        } catch (error) {
            console.log('Logout API call failed:', error);
        }
        
        // Sign out from Google if applicable
        if (this.currentUser?.provider === 'google' && window.google) {
            try {
                window.google.accounts.id.disableAutoSelect();
            } catch (error) {
                console.log('Google sign-out error:', error);
            }
        }
        
        // Clear local storage
        this.authToken = null;
        localStorage.removeItem('messad_auth_token');
        
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
