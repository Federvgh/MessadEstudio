// Azure AD B2C Configuration
const msalConfig = {
    auth: {
        // TODO: Replace with your Azure AD B2C tenant details
        clientId: "YOUR_CLIENT_ID", // Application (client) ID from Azure portal
        authority: "https://YOUR_TENANT_NAME.b2clogin.com/YOUR_TENANT_NAME.onmicrosoft.com/B2C_1_SIGNIN_SIGNUP", // Policy authority
        knownAuthorities: ["YOUR_TENANT_NAME.b2clogin.com"], // Mark B2C tenant as known authority
        redirectUri: window.location.origin, // Must be registered in Azure portal
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
const loginRequest = {
    scopes: ["openid", "profile"]
};

// Add scopes here for access token to be used at custom web API endpoints.
const tokenRequest = {
    scopes: ["openid", "profile"],
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};

// Configuration object to be passed to Msal on creation
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Setup instructions for Azure AD B2C:
// 1. Go to Azure Portal: https://portal.azure.com
// 2. Create an Azure AD B2C tenant or use existing one
// 3. Register a new application in App registrations
// 4. Configure redirect URI: add your domain (e.g., http://localhost:3000 for local, https://yourdomain.com for production)
// 5. Create user flow (B2C_1_SIGNIN_SIGNUP) for sign-up and sign-in
// 6. Configure Google as identity provider in your B2C tenant
// 7. Replace the placeholder values above with your actual values
