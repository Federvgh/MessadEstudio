# Messad Estudio Backend Setup Guide

This backend provides authentication and user management for the Messad Estudio website with support for both email/password and Google OAuth authentication.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Cloud Console project for OAuth

## Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/messad-estudio

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_PRODUCTION=https://yourdomain.com
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
Install MongoDB locally and ensure it's running on the default port (27017).

#### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and replace `MONGODB_URI` in `.env`

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the authorized origins:
   - `http://localhost:3000` (development)
   - Your production domain
6. Copy the Client ID and Client Secret to your `.env` file

### 5. Update Frontend Configuration

Update your frontend's `simple-auth.js` with your actual backend URL and Google Client ID:

```javascript
// In js/simple-auth.js
constructor() {
    this.apiBaseUrl = 'http://localhost:3001/api'; // Your backend URL
    // ...
}

// In the Google initialization
client_id: "YOUR_ACTUAL_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

## Running the Backend

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Email/password registration
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/verify-token` - Verify JWT token
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Deactivate account
- `POST /api/users/google-auth` - Legacy Google auth endpoint

### System
- `GET /api/health` - Health check
- `GET /` - API information

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Input validation
- SQL injection protection
- Helmet security headers

## Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (required for email provider),
  name: String (required),
  firstName: String,
  lastName: String,
  picture: String,
  provider: String (email|google),
  googleId: String (unique),
  isActive: Boolean,
  isEmailVerified: Boolean,
  lastLogin: Date,
  loginCount: Number,
  preferences: {
    notifications: Boolean,
    language: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Testing the API

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Register New User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/messad-estudio
JWT_SECRET=your-very-secure-production-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
FRONTEND_URL_PRODUCTION=https://your-domain.com
```

### Deploy to Heroku
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy from Git

### Deploy to VPS
1. Clone the repository
2. Set up environment variables
3. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "messad-api"
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string format
   - Verify network access for MongoDB Atlas

2. **Google OAuth Not Working**
   - Verify Google Client ID is correct
   - Check authorized origins in Google Console
   - Ensure domains match exactly

3. **CORS Errors**
   - Add your frontend URL to CORS configuration
   - Check protocol (http vs https)

4. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format in Authorization header

### Enable Debug Logging
Set environment variable:
```bash
DEBUG=* npm run dev
```

## Support

For issues or questions, check the logs and ensure all environment variables are properly configured. The API includes comprehensive error handling and logging to help identify issues.
