// Configuration for Messad Estudio Frontend
// This file contains non-sensitive configuration that can be safely committed

window.MessadConfig = {
    // API Configuration
    apiBaseUrl: 'http://localhost:3001/api',
    apiBaseUrlProduction: 'https://your-backend-domain.com/api',
    
    // Google OAuth Configuration
    // IMPORTANT: This should be a PUBLIC Client ID (not secret)
    // Get this from your Google Cloud Console OAuth 2.0 Client ID
    googleClientId: '351443761963-ra7sbb1m84nrisno7vl7q6clboq3ge30.apps.googleusercontent.com',
    
    // Environment detection
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    // Get appropriate API base URL based on environment
    getApiBaseUrl: function() {
        return this.isProduction ? this.apiBaseUrlProduction : this.apiBaseUrl;
    }
};