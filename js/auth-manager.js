// Authentication Manager for Messad Estudio
class AuthManager {
    constructor() {
        this.msalInstance = msalInstance;
        this.currentAccount = null;
        this.init();
    }

    async init() {
        await this.msalInstance.initialize();
        this.handleRedirectPromise();
        this.updateUI();
    }

    async handleRedirectPromise() {
        try {
            const response = await this.msalInstance.handleRedirectPromise();
            if (response) {
                this.currentAccount = response.account;
                this.updateUI();
                this.closeLoginModal();
                console.log('Login successful:', response);
            }
        } catch (error) {
            console.error('Error handling redirect:', error);
        }
    }

    async login() {
        try {
            const response = await this.msalInstance.loginPopup(loginRequest);
            this.currentAccount = response.account;
            this.updateUI();
            this.closeLoginModal();
            console.log('Login successful:', response);
            return response;
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
            await this.msalInstance.logoutPopup(logoutRequest);
            this.currentAccount = null;
            this.updateUI();
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error);
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
        const userInfo = this.getUserInfo();

        if (this.isLoggedIn() && userInfo) {
            // User is logged in - show user name and logout option
            loginBtn.innerHTML = `${userInfo.name} <span class="ms-1">▾</span>`;
            loginBtn.onclick = (e) => {
                e.preventDefault();
                this.showUserMenu();
            };
        } else {
            // User is not logged in - show login button
            loginBtn.innerHTML = 'Login';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                this.showLoginModal();
            };
        }
    }

    showLoginModal() {
        const loginModal = document.getElementById('loginModal');
        loginModal.style.display = 'block';
        loginModal.classList.add('show');
        document.body.classList.add('modal-open');
    }

    closeLoginModal() {
        const loginModal = document.getElementById('loginModal');
        loginModal.style.display = 'none';
        loginModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }

    showUserMenu() {
        // Create a simple dropdown menu for logged-in users
        const userInfo = this.getUserInfo();
        const confirmed = confirm(`Logged in as: ${userInfo.name}\n\nClick OK to logout, Cancel to close.`);
        if (confirmed) {
            this.logout();
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
            modalBody.insertBefore(errorDiv, modalBody.firstChild);
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
    window.authManager = new AuthManager();
});

// Export for use in other files
window.AuthManager = AuthManager;
