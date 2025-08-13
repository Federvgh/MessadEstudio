# Azure AD B2C Setup Guide for Messad Estudio

## Prerequisites
- Azure subscription (free tier works)
- Domain name for your website

## Step 1: Create Azure AD B2C Tenant

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Azure Active Directory B2C"
4. Click "Create"
5. Choose "Create a new Azure AD B2C Tenant"
6. Fill in:
   - Organization name: `MessadEstudio`
   - Initial domain name: `messadestudio` (this will create messadestudio.onmicrosoft.com)
   - Country/Region: Your country
7. Click "Review + create" then "Create"

## Step 2: Switch to B2C Tenant

1. In Azure Portal, click on your profile in top right
2. Click "Switch directory"
3. Select your new B2C tenant

## Step 3: Register Your Application

1. In your B2C tenant, go to "Azure AD B2C" service
2. Go to "App registrations" → "New registration"
3. Fill in:
   - Name: `Messad Estudio Website`
   - Supported account types: "Accounts in any identity provider or organizational directory"
   - Redirect URI: 
     - Type: "Single-page application (SPA)"
     - URL: `http://localhost:3000` (for local testing)
     - Add production URL later: `https://yourdomain.com`
4. Click "Register"
5. **Copy the Application (client) ID** - you'll need this!

## Step 4: Configure Authentication

1. In your app registration, go to "Authentication"
2. Under "Single-page application", add redirect URIs:
   - `http://localhost:3000` (local testing)
   - `https://yourdomain.com` (production)
3. Under "Advanced settings":
   - Enable "Access tokens" and "ID tokens"
4. Click "Save"

## Step 5: Create User Flow

1. Go to "Azure AD B2C" → "User flows"
2. Click "New user flow"
3. Select "Sign up and sign in" → "Recommended"
4. Name: `B2C_1_SIGNIN_SIGNUP`
5. Under "Identity providers":
   - Check "Email signup"
6. Under "User attributes and token claims":
   - Collect: "Display Name", "Email Address"
   - Return: "Display Name", "Email Addresses", "User's Object ID"
7. Click "Create"

## Step 6: Add Google Identity Provider (Optional)

1. Go to "Azure AD B2C" → "Identity providers"
2. Click "New OpenID Connect provider"
3. Name: `Google`
4. You'll need to:
   - Create a Google OAuth app at [Google Cloud Console](https://console.cloud.google.com/)
   - Get Client ID and Client Secret from Google
   - Set authorized redirect URI: `https://messadestudio.b2clogin.com/messadestudio.onmicrosoft.com/oauth2/authresp`
5. Configure the provider with Google credentials
6. Go back to your user flow and add Google as an identity provider

## Step 7: Update Your Code

Edit `js/auth-config.js` and replace:

```javascript
clientId: "YOUR_CLIENT_ID", // Replace with your Application (client) ID
authority: "https://messadestudio.b2clogin.com/messadestudio.onmicrosoft.com/B2C_1_SIGNIN_SIGNUP",
knownAuthorities: ["messadestudio.b2clogin.com"],
```

## Step 8: Test Your Setup

1. Open your website
2. Click "Login"
3. You should be redirected to Azure B2C login page
4. Test both email signup and Google sign-in (if configured)

## Production Deployment

1. Update redirect URIs in Azure to include your production domain
2. Update `auth-config.js` with production URLs
3. Test thoroughly before going live

## Troubleshooting

- Check browser console for errors
- Verify redirect URIs match exactly
- Ensure user flow is published and working
- Test with incognito/private browsing

## Security Notes

- Never expose client secrets in frontend code
- Use HTTPS in production
- Configure CORS properly
- Regular security audits recommended

## Cost

- Azure AD B2C: First 50,000 monthly active users are free
- Additional users: ~$0.00325 per user per month
- Very cost-effective for most small to medium websites
