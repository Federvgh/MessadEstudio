# Messad Estudio - Complete Authentication Setup Guide

This guide will help you set up a complete authentication system with both email/password and Google OAuth for your Messad Estudio website.

## 🎯 What You'll Get

- **Email/Password Registration**: Users can create accounts with email and password
- **Google OAuth**: Quick sign-in with Google accounts
- **JWT Authentication**: Secure token-based authentication
- **User Management**: User profiles, sessions, and preferences
- **Security**: Password hashing, rate limiting, CORS protection

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available)
- **Google Cloud Account** - For OAuth setup (free)
- **Basic terminal/command line knowledge**

## 🚀 Quick Start

### Step 1: Backend Setup

1. **Install dependencies and create environment file:**
   ```bash
   ./setup-backend.sh
   ```

2. **Configure your environment:**
   Edit `backend/.env` with your settings:
   ```env
   # Database - Use MongoDB Atlas or local MongoDB
   MONGODB_URI=mongodb://localhost:27017/messad-estudio
   
   # Security - Generate a strong secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Google OAuth - Get from Google Cloud Console
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### Step 2: Google OAuth Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Create a new project or select existing one**

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "Messad Estudio Auth"

5. **Configure authorized origins:**
   ```
   http://localhost:3000
   http://127.0.0.1:5500
   https://yourdomain.com
   ```

6. **Copy credentials to your `.env` file**

### Step 3: Database Setup

Choose one option:

#### Option A: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/messad-estudio`

### Step 4: Update Frontend

1. **Update API URL in `js/simple-auth.js`:**
   ```javascript
   this.apiBaseUrl = 'http://localhost:3001/api'; // Already updated
   ```

2. **Update Google Client ID in `js/simple-auth.js`:**
   ```javascript
   client_id: "YOUR_ACTUAL_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
   ```

### Step 5: Start the Backend

```bash
cd backend
npm run dev
```

The API will start at `http://localhost:3001`

## 🧪 Testing Your Setup

### 1. Test Backend Health
Open browser to: `http://localhost:3001/api/health`

Should see:
```json
{
  "status": "OK",
  "timestamp": "2025-01-13T...",
  "uptime": 5.123,
  "environment": "development"
}
```

### 2. Test Registration
1. Open your website
2. Click "Login" button
3. Switch to "Register" tab
4. Create a new account
5. Check browser console for success messages

### 3. Test Google Login
1. Click "Continue with Google"
2. Select your Google account
3. Should automatically log you in

## 🏗️ Architecture Overview

```
Frontend (HTML/JS)
    ↓
Authentication Manager (simple-auth.js)
    ↓
Backend API (Node.js/Express)
    ↓
Database (MongoDB)
```

### API Endpoints

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google` - Google OAuth
- `GET /api/users/profile` - Get user profile
- `POST /api/auth/logout` - Logout

### Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: 7-day expiration
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS Protection**: Configured for your domains
- **Input Validation**: Email format, password length
- **SQL Injection Protection**: MongoDB ODM

## 🚀 Deployment

### Frontend Deployment
Your current hosting setup should work. Just make sure to update:
- `apiBaseUrl` to your production API URL
- Google OAuth authorized origins

### Backend Deployment Options

#### Heroku (Easy)
1. Create Heroku app
2. Set environment variables in dashboard
3. Connect to GitHub and deploy

#### DigitalOcean/AWS/VPS
1. Deploy code to server
2. Install Node.js and MongoDB
3. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name messad-api
   ```

#### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/messad-estudio
JWT_SECRET=your-very-secure-production-secret-key
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
FRONTEND_URL_PRODUCTION=https://yourdomain.com
```

## 🔧 Troubleshooting

### Common Issues

**1. Backend won't start**
- Check MongoDB is running
- Verify .env file exists and has correct values
- Check port 3001 isn't already in use

**2. Google OAuth not working**
- Verify Client ID matches in both Google Console and code
- Check authorized origins include your exact domain
- Ensure Google+ API is enabled

**3. CORS errors**
- Add your frontend URL to CORS configuration in `server.js`
- Check protocol matches (http vs https)

**4. Database connection failed**
- For local MongoDB: ensure service is running
- For Atlas: check connection string format and network access

**5. Authentication not working**
- Check network tab in browser for API errors
- Verify backend is running and accessible
- Check console for error messages

### Debug Mode

Enable detailed logging:
```bash
DEBUG=* npm run dev
```

## 📱 Mobile Considerations

The authentication system works on mobile devices. The login modal is responsive and Google OAuth works on mobile browsers.

## 🔒 Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (32+ characters)
3. **Enable HTTPS** in production
4. **Regular security updates**
5. **Monitor authentication logs**

## 📈 Next Steps

After basic setup, you can:

1. **Add email verification** for new accounts
2. **Implement password reset** functionality
3. **Add user roles** (admin, user, etc.)
4. **Social logins** (Facebook, Twitter)
5. **Two-factor authentication**
6. **User analytics** and dashboards

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Check backend logs
3. Verify all environment variables are set
4. Test API endpoints directly with tools like Postman
5. Review the backend/README.md for detailed API documentation

## 📝 Files Created/Modified

### New Backend Files
- `backend/server.js` - Main server
- `backend/models/User.js` - User database model
- `backend/routes/auth.js` - Authentication routes
- `backend/routes/users.js` - User management routes
- `backend/package.json` - Dependencies
- `backend/.env.example` - Environment template

### Modified Frontend Files
- `js/simple-auth.js` - Updated to use real backend

### Setup Files
- `setup-backend.sh` - Automated setup script
- `AUTHENTICATION_SETUP.md` - This guide

The authentication system is now production-ready with proper security, error handling, and scalability!
