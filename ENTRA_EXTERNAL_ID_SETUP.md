# Microsoft Entra External ID Setup Guide
## 🎯 Updated Authentication Solution (2025)

> **Important:** Azure AD B2C is being replaced by **Microsoft Entra External ID**. This is the new recommended approach for customer authentication.

## ✅ Benefits of Microsoft Entra External ID
- ✅ **Free for up to 50,000 monthly active users**
- ✅ **Modern authentication experience**
- ✅ **Built-in Google, Facebook, Microsoft sign-in**
- ✅ **Better security and management**
- ✅ **Easier setup than B2C**

## 🚀 Setup Steps

### Step 1: Access Microsoft Entra External ID
1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your Microsoft account
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

### Step 6: Set Up Social Providers (Optional)
1. In Microsoft Entra ID, go to **"External Identities"** → **"All identity providers"**
2. Click **"+ New Google"** to add Google sign-in
3. Follow the wizard to configure Google authentication

### Step 7: Test Your Authentication
1. Open your website
2. Click the **"Login"** button
3. You should be redirected to Microsoft's secure sign-in page
4. Create a test account and verify the flow works

## 🎯 Your Updated Configuration

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
- Same pricing model as B2C, but better features!

## 🆘 Troubleshooting
- **Redirect URI mismatch**: Ensure your website URL matches exactly in Azure
- **CORS errors**: Make sure you're using HTTPS in production
- **Authentication fails**: Double-check your client ID and tenant ID

## 📞 Need Help?
If you encounter any issues, the authentication is already coded and ready - you just need to update the configuration values!

## 🔄 Migration from B2C
If you had started with B2C, this new approach is:
- ✅ **Easier to set up**
- ✅ **Better user experience**
- ✅ **Same pricing**
- ✅ **Future-proof**
