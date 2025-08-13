# 🚀 Quick Development Guide

## Getting Started (5 minutes)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start MongoDB
**Option A: Local MongoDB**
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or start manually
mongod
```

**Option B: MongoDB Atlas (Free, Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

### 3. Configure Google OAuth (Optional but recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 Client ID
4. Add authorized origins:
   - `http://127.0.0.1:5500`
   - `http://localhost:3000`
5. Copy Client ID/Secret to `backend/.env`
6. Update Client ID in `js/simple-auth.js`

### 4. Start Backend Server
```bash
cd backend
npm run dev
```
✅ Should see: "Messad Estudio API running on port 3001"

### 5. Test Backend
Open: http://localhost:3001/api/health
✅ Should see: `{"status": "OK", ...}`

### 6. Start Frontend
Use VS Code Live Server extension or any local server

### 7. Test Authentication
1. Open your website
2. Click "Login" 
3. Try creating an account with email/password
4. Check browser console for success messages

## VS Code Tasks (Ctrl+Shift+P → "Tasks: Run Task")

- **Setup Backend** - One-time setup
- **Start Backend Server** - Start the API server
- **Install Backend Dependencies** - Install npm packages
- **Test Backend Health** - Check if API is running

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify port 3001 isn't in use
- Check `backend/.env` file exists

### CORS errors in browser
- Ensure backend is running
- Check frontend URL matches CORS config
- Try different port (5500, 3000)

### Google OAuth not working
- Verify Client ID in both Google Console and code
- Check authorized origins match exactly
- Ensure Google+ API is enabled

### Database connection failed
- For local: `brew services start mongodb-community`
- For Atlas: Check connection string format

## 📱 Testing Checklist

- [ ] Backend health endpoint responds
- [ ] Email registration works
- [ ] Email login works
- [ ] Google OAuth works (if configured)
- [ ] User stays logged in after refresh
- [ ] Logout works
- [ ] Modal opens/closes properly

## 🎯 What's Working

- ✅ Complete authentication system
- ✅ MongoDB user storage
- ✅ JWT token security
- ✅ Google OAuth ready
- ✅ Password hashing
- ✅ Session persistence
- ✅ Mobile responsive
- ✅ CORS configured
- ✅ Rate limiting
- ✅ Error handling

## 🚀 Next Steps

1. Configure Google OAuth for production
2. Set up MongoDB Atlas for production
3. Deploy backend (Heroku, DigitalOcean, etc.)
4. Update frontend API URLs for production
5. Add email verification (optional)
6. Add password reset (optional)

The authentication system is production-ready! 🎉
