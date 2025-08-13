# Simple Authentication Setup with Google Sign-In

## 🎯 What This System Provides

✅ **Google Sign-In** - One-click authentication with Google accounts
✅ **Email/Password Registration** - Traditional account creation
✅ **Local Session Management** - Remembers users for 7 days
✅ **No Azure/Microsoft Required** - Simpler setup
✅ **Development Mode** - Works without backend for testing

## 🚀 How to Set Up Google Sign-In (5 minutes)

### Step 1: Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Application type: "Web application"
6. Authorized JavaScript origins: 
   - `http://localhost:5500`
   - `https://yourdomain.com` (for production)
7. Copy the Client ID (looks like: `123456789-abc123.apps.googleusercontent.com`)

### Step 2: Update the Code

In `js/simple-auth.js`, replace this line:
```javascript
client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
```

With your actual Google Client ID:
```javascript
client_id: "123456789-abc123.apps.googleusercontent.com",
```

## 🧪 Testing Right Now (No Setup Required)

The system currently works in "development mode" - you can test:

1. **Email/Password Registration**:
   - Click "Login" → "Registrarse"
   - Enter any email, password, and name
   - System simulates account creation

2. **Email/Password Login**:
   - Click "Login" → "Iniciar Sesión" 
   - Enter any email and password
   - System simulates login

3. **User Session**:
   - After login, refresh the page
   - User stays logged in (session saved)
   - Click user name to see profile menu

## 🔧 How It Works

### Authentication Flow:
```
User Options:
├── Google Sign-In → Google popup → Auto account creation
├── Email Registration → Create new account → Login
└── Email Login → Verify credentials → Login
```

### Current Behavior (Development Mode):
- **Google Sign-In**: Shows popup when you set up Client ID
- **Email/Password**: Simulates backend, creates fake user accounts
- **Session Management**: Saves to localStorage, persists across page loads
- **UI Updates**: Shows user name in navigation when logged in

## 📱 User Experience

### For New Users:
1. Click "Login"
2. Choose between:
   - **Google**: One click, instant account
   - **Email**: Fill form, create account
3. Automatically logged in
4. Session saved for 7 days

### For Returning Users:
1. Page loads → Automatically logged in (if within 7 days)
2. Click username → Profile menu
3. Option to logout

## 🏗️ Backend Setup (Optional)

When you're ready for production, you'll need:

### Simple Backend API (Node.js/Express example):
```javascript
// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  // Hash password, save to database
  // Return user object
});

// POST /api/auth/login  
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // Verify password, load user from database
  // Return user object
});

// POST /api/users/google-auth
app.post('/api/users/google-auth', async (req, res) => {
  const googleUser = req.body;
  // Create or find user in database
  // Return user object
});
```

### Database Schema:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for Google users
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'email' or 'google'
  google_id VARCHAR(255), -- NULL for email users
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

## 🎯 Next Steps

### Immediate (Test Now):
1. **Test email registration** - Create account with any email
2. **Test login/logout** - See session management working
3. **Test persistence** - Refresh page, user stays logged in

### For Google Sign-In (5 minutes):
1. **Get Google Client ID** from Google Cloud Console
2. **Update the code** with your Client ID
3. **Test Google authentication**

### For Production (Later):
1. **Set up simple backend** API
2. **Choose database** (PostgreSQL, MySQL, etc.)
3. **Update API URL** in `simple-auth.js`
4. **Deploy and test**

## 🔍 Current Status

**✅ Working Now:**
- Email/password authentication (simulated)
- User session management
- Login/logout flow
- UI updates

**🚧 Needs Setup:**
- Google Client ID (5 minutes)
- Production backend (when ready)

**🎉 Benefits:**
- No Azure/Microsoft complexity
- Simple Google + email authentication
- Works offline for development
- Easy to understand and modify
- Fast user experience
