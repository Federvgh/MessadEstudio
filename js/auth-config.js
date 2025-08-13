// Microsoft Entra External ID Configuration (Modern Azure Authentication)
const msalConfig = {
    auth: {
        // ✅ CONFIGURED: Microsoft Entra External ID details
        clientId: "f8752e53-b8c4-41ce-abd3-0ccbcc85c8d3", // Application (client) ID from Azure portal
        authority: "https://login.microsoftonline.com/5645e8d8-96c8-418d-9a7b-f89f822073bd", // Your tenant authority
        redirectUri: window.location.origin, // Must be registered in Azure portal
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
const loginRequest = {
    scopes: ["openid", "profile", "email"]
};

// Add scopes here for access token to be used at custom web API endpoints.
const tokenRequest = {
    scopes: ["openid", "profile", "email"],
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};

// Configuration object to be passed to Msal on creation
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Debug: Check if MSAL is loaded
console.log('MSAL loaded:', typeof msal !== 'undefined');
console.log('MSAL config:', msalConfig);
console.log('Current URL:', window.location.origin);

// 🎯 CONFIGURATION COMPLETE ✅
// Your Azure credentials have been configured:
// ✅ Client ID: f8752e53-b8c4-41ce-abd3-0ccbcc85c8d3
// ✅ Tenant ID: 5645e8d8-96c8-418d-9a7b-f89f822073bd
// ✅ Object ID: 2f9436d4-209b-42c2-82db-08b390709a07
//
// 🚀 NEXT STEPS:
// 1. ✅ Configuration complete!
// 2. 🌐 Your Azure redirect URIs include port 5500 ✅
// 3. 🔧 Test the login functionality
// 4. 🔗 Configure Google identity provider in Azure (optional)
//
// 📍 IMPORTANT: You're using port 5500 which is already configured in Azure!
// 🎉 Your authentication system is ready to use!