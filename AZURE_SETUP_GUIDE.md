# Microsoft Entra External ID Setup Guide for Messad Estudio

## 🎯 Overview
This guide will help you set up **Microsoft Entra External ID** (the modern replacement for Azure AD B2C) with both email/password authentication AND Google sign-in for your Messad Estudio website.

## ✅ Benefits
- ✅ **Free for up to 50,000 monthly active users**
- ✅ **Modern authentication experience**
- ✅ **Built-in Google, Facebook, Microsoft sign-in**
- ✅ **Better security and management**
- ✅ **Easier setup than B2C**

## 🚀 Step-by-Step Setup

### Step 1: Access Microsoft Entra External ID
1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your Microsoft account (create one if needed)
3. Search for **"Microsoft Entra ID"** (not B2C)
4. Click on **"External Identities"** in the left menu
5. Click **"External configurations"**

### Step 2: Create App Registration
1. Go to **"App registrations"** in Microsoft Entra ID
2. Click **"New registration"**
3. Fill in the details:
   ```
   Name: Messad Estudio Authentication
   Supported account types: Accounts in any identity provider or organizational directory (for authenticating users with user flows)
   Redirect URI: 
   - Type: Single-page application (SPA)
   - URL: https://yourdomain.com (your actual website URL)
   ```
4. Click **"Register"**

### Step 3: Configure Authentication
1. In your new app registration, click **"Authentication"**
2. Under **"Single-page application"**, add these redirect URIs:
   ```
   https://yourdomain.com
   https://yourdomain.com/index.html
   http://localhost:3000 (for local testing)
   ```
3. Under **"Implicit grant and hybrid flows"**, check:
   - ✅ **Access tokens**
   - ✅ **ID tokens**
4. Click **"Save"**

### Step 4: Copy Your Configuration
1. Go to **"Overview"** of your app registration
2. **Copy** the following values:
   - **Application (client) ID**
   - **Directory (tenant) ID**

### Step 5: Update Your Code
1. Open `js/auth-config.js` in your project
2. Replace:
   ```javascript
   clientId: "PASTE_YOUR_CLIENT_ID_HERE"
   ```
   with your actual **Application (client) ID**

3. Replace:
   ```javascript
   authority: "https://login.microsoftonline.com/PASTE_YOUR_TENANT_ID_HERE"
   ```
   with your actual **Directory (tenant) ID**

### Step 6: Set Up Google Identity Provider
1. In Microsoft Entra ID, go to **"External Identities"** → **"All identity providers"**
2. Click **"+ New Google"**
3. You'll need to:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or use existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Set authorized redirect URI: `https://login.microsoftonline.com/te/{tenant-id}/oauth2/authresp`
4. Copy the Client ID and Client Secret from Google
5. Paste them in the Azure configuration
6. Click **"Save"**

### Step 7: Test Your Authentication
1. Open your website
2. Click the **"Login"** button
3. You should be redirected to Microsoft's secure sign-in page
4. You can either:
   - Create a new account with email/password
   - Sign in with Google (if configured)

## 🎯 Your Configuration Example

After setup, your `auth-config.js` should look like:
```javascript
const msalConfig = {
    auth: {
        clientId: "12345678-1234-1234-1234-123456789012", // Your actual client ID
        authority: "https://login.microsoftonline.com/87654321-4321-4321-4321-210987654321", // Your actual tenant ID
        redirectUri: window.location.origin,
    },
    // ... rest of config
};
```

## 💰 Pricing
- **FREE** for up to 50,000 monthly active users
- Only pay if you exceed 50k users
- Very cost-effective for most small to medium websites

## 🔧 Local Testing
1. Set redirect URI to `http://localhost:3000`
2. Serve your site locally using a simple HTTP server
3. Test login/logout functionality

## 🌐 Production Deployment
1. Update redirect URIs in Azure to include production domain
2. Test thoroughly in staging environment
3. Deploy with HTTPS enabled

## 🆘 Troubleshooting
- **Redirect URI mismatch**: Ensure your website URL matches exactly in Azure
- **CORS errors**: Make sure you're using HTTPS in production
- **Authentication fails**: Double-check your client ID and tenant ID
- **Google sign-in not working**: Verify Google OAuth configuration

## 📞 Need Help?
The authentication system is already coded and ready - you just need to update the configuration values in `js/auth-config.js`!

## 🔄 What's Included
✅ **Login/Logout functionality**
✅ **User session management**
✅ **Error handling**
✅ **Modal-based authentication**
✅ **Google sign-in integration**
✅ **Responsive design**
✅ **Security best practices**

---

**Status**: ✅ Ready for Azure configuration
**Next Action**: Follow this guide step by step
