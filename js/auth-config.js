// Microsoft Entra External ID Configuration (Modern Azure Authentication)
const msalConfig = {
    auth: {
        // TODO: Replace with your Microsoft Entra External ID details
        clientId: "PASTE_YOUR_CLIENT_ID_HERE", // Application (client) ID from Azure portal
        authority: "https://login.microsoftonline.com/PASTE_YOUR_TENANT_ID_HERE", // Your tenant authority
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

// 🎯 UPDATED SETUP INSTRUCTIONS for Microsoft Entra External ID:
// 1. ✅ Go to Azure Portal → "Microsoft Entra ID" (not B2C)
// 2. ✅ Create new application registration
// 3. ✅ Configure for external users (customers/partners)
// 4. ✅ Copy CLIENT ID and TENANT ID
// 5. ✅ Replace values above
// 6. ✅ Test your authentication flow
//
// 🚀 This is the NEW recommended way - better than B2C!
