// Authentication Manager for Messad Estudio
class AuthManager {
    constructor() {
        this.msalInstance = msalInstance;
        this.currentAccount = null;
        this.init();
    }

    async init() {
        console.log('AuthManager initializing...');
        try {
            await this.msalInstance.initialize();
            console.log('MSAL instance initialized successfully');
            this.handleRedirectPromise();
            this.updateUI();
            console.log('AuthManager initialization complete');
        } catch (error) {
            console.error('Error during AuthManager initialization:', error);
        }
    }

    async handleRedirectPromise() {
        try {
            const response = await this.msalInstance.handleRedirectPromise();
            if (response) {
                this.currentAccount = response.account;
                await this.handleSuccessfulLogin(response.account);
                this.updateUI();
                this.closeLoginModal();
                console.log('Login successful:', response);
            }
        } catch (error) {
            console.error('Error handling redirect:', error);
        }
    }

    async login(options = {}) {
        console.log('Login function called with options:', options);
        try {
            console.log('Attempting MSAL login redirect (to avoid popup blocking)...');
            
            // Use redirect instead of popup to avoid blocking issues
            const loginRequestWithHints = { ...loginRequest };
            
            if (options.hint === 'google') {
                loginRequestWithHints.domainHint = 'google.com';
                loginRequestWithHints.prompt = 'select_account';
                console.log('Google hint applied to login request');
            }
            
            // Use redirect instead of popup to avoid browser blocking
            await this.msalInstance.loginRedirect(loginRequestWithHints);
            
        } catch (error) {
            console.error('Login failed:', error);
            this.showLoginError(error.message);
            throw error;
        }
    }

    async logout() {
        const logoutRequest = {
            account: this.currentAccount,
            postLogoutRedirectUri: window.location.origin
        };

        try {
            // Clear user data first
            if (window.userManager) {
                window.userManager.clearUserSession();
            }
            
            await this.msalInstance.logoutPopup(logoutRequest);
            this.currentAccount = null;
            this.updateUI();
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    // Handle successful login - integrate with UserManager
    async handleSuccessfulLogin(account) {
        console.log('Handling successful login for:', account.username);
        
        // Wait for UserManager to be available
        if (window.userManager) {
            try {
                await window.userManager.loadUserProfile();
                console.log('User profile loaded successfully');
            } catch (error) {
                console.error('Error loading user profile:', error);
                // Continue with basic auth even if user management fails
            }
        } else {
            console.warn('UserManager not available, will retry in 1 second');
            // Retry after UserManager loads
            setTimeout(async () => {
                if (window.userManager) {
                    try {
                        await window.userManager.loadUserProfile();
                        console.log('User profile loaded successfully (delayed)');
                    } catch (error) {
                        console.error('Error loading user profile (delayed):', error);
                    }
                }
            }, 1000);
        }
    }

    async getToken() {
        if (!this.currentAccount) {
            throw new Error('No account logged in');
        }

        try {
            const response = await this.msalInstance.acquireTokenSilent({
                ...tokenRequest,
                account: this.currentAccount
            });
            return response.accessToken;
        } catch (error) {
            console.error('Token acquisition failed:', error);
            // If silent token acquisition fails, fall back to interactive method
            const response = await this.msalInstance.acquireTokenPopup(tokenRequest);
            return response.accessToken;
        }
    }

    isLoggedIn() {
        return this.currentAccount !== null;
    }

    getUserInfo() {
        if (!this.currentAccount) {
            return null;
        }

        return {
            name: this.currentAccount.name,
            email: this.currentAccount.username,
            id: this.currentAccount.localAccountId
        };
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        if (!loginBtn) {
            console.log('Login button not found on this page');
            return; // Skip if login button doesn't exist on this page
        }
        
        console.log('Updating UI, login button found');
        const userInfo = this.getUserInfo();
        const userData = window.userManager ? window.userManager.getCurrentUser() : null;

        if (this.isLoggedIn() && userInfo) {
            // User is logged in - show user name and logout option
            const displayName = userData?.profileData?.firstName || userInfo.name.split(' ')[0] || userInfo.name;
            loginBtn.innerHTML = `${displayName} <span class="ms-1">▾</span>`;
            loginBtn.onclick = (e) => {
                e.preventDefault();
                this.showUserMenu();
            };
        } else {
            // User is not logged in - show login button
            loginBtn.innerHTML = 'Login';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                console.log('Login button clicked!');
                this.showLoginModal();
            };
        }
    }

    showLoginModal() {
        console.log('Attempting to show login modal');
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            console.log('Login modal found, showing it');
            loginModal.style.display = 'block';
            loginModal.classList.add('show');
            document.body.classList.add('modal-open');
        } else {
            console.error('Login modal not found! This page might not have a modal.');
            // Fallback: directly trigger login
            console.log('Triggering direct login as fallback');
            this.login();
        }
    }

    closeLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'none';
            loginModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
    }

    showUserMenu() {
        // Create enhanced dropdown menu for logged-in users
        const userInfo = this.getUserInfo();
        const userData = window.userManager ? window.userManager.getCurrentUser() : null;
        
        const displayName = userData?.profileData?.firstName || userInfo.name.split(' ')[0] || userInfo.name;
        const email = userInfo.email;
        const provider = userData?.provider || 'azure';
        
        const menuOptions = [
            `👤 ${displayName}`,
            `📧 ${email}`,
            `🔗 Via ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
            '',
            '⚙️ Profile Settings',
            '🔓 Logout'
        ];
        
        const choice = prompt(
            `Usuario Autenticado:\n\n${menuOptions.slice(0, 4).join('\n')}\n\nSelecciona una opción:\n5. ${menuOptions[4]}\n6. ${menuOptions[5]}`,
            ''
        );
        
        if (choice === '5') {
            this.showProfileSettings();
        } else if (choice === '6') {
            this.logout();
        }
    }

    showProfileSettings() {
        // Show profile settings modal or redirect
        const userData = window.userManager ? window.userManager.getCurrentUser() : null;
        
        if (!userData) {
            alert('No se pudieron cargar los datos del usuario.');
            return;
        }
        
        const currentFirstName = userData.profileData?.firstName || '';
        const currentLastName = userData.profileData?.lastName || '';
        
        const firstName = prompt('Nombre:', currentFirstName);
        if (firstName === null) return; // User cancelled
        
        const lastName = prompt('Apellido:', currentLastName);
        if (lastName === null) return; // User cancelled
        
        // Update profile
        if (window.userManager) {
            window.userManager.updateProfile({
                profileData: {
                    ...userData.profileData,
                    firstName: firstName,
                    lastName: lastName
                }
            }).then(() => {
                alert('Perfil actualizado exitosamente!');
                this.updateUI(); // Refresh UI
            }).catch(error => {
                console.error('Profile update error:', error);
                alert('Error al actualizar el perfil. Inténtalo de nuevo.');
            });
        }
    }

    showLoginError(message) {
        // Show error in the modal
        let errorDiv = document.getElementById('loginError');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'loginError';
            errorDiv.className = 'alert alert-danger mt-2';
            const modalBody = document.querySelector('#loginModal .modal-body');
            if (modalBody) {
                modalBody.insertBefore(errorDiv, modalBody.firstChild);
            }
        }
        errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
        errorDiv.style.display = 'block';
    }

    hideLoginError() {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing AuthManager');
    window.authManager = new AuthManager();
    
    // Additional safety check for login button
    setTimeout(function() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            console.log('Login button found, adding click listener as backup');
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Backup click handler triggered!');
                window.authManager.showLoginModal();
            });
        } else {
            console.log('Login button not found on this page');
        }
    }, 1000);
});

// Export for use in other files
window.AuthManager = AuthManager;