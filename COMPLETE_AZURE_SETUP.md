# Complete Azure Setup for User Registration & Google Sign-In

## Overview
This guide will help you set up a complete authentication system with:
- ✅ User registration and profile storage in Azure SQL Database
- ✅ Google Sign-In integration through Azure Entra External ID
- ✅ Secure API endpoints for user management
- ✅ Session management and user profiles

## Part 1: Azure SQL Database Setup

### 1.1 Create Azure SQL Database
```bash
# Via Azure CLI (or use Azure Portal)
az sql server create \
  --name messad-estudio-sql-server \
  --resource-group MessadEstudio \
  --location "East US" \
  --admin-user messadadmin \
  --admin-password "YourSecurePassword123!"

az sql db create \
  --resource-group MessadEstudio \
  --server messad-estudio-sql-server \
  --name MessadEstudioDB \
  --service-objective Basic
```

### 1.2 Create Database Tables
Connect to your Azure SQL Database and run:

```sql
-- Users table
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    AzureId NVARCHAR(255) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Name NVARCHAR(255) NOT NULL,
    Provider NVARCHAR(50) NOT NULL, -- 'microsoft' or 'google'
    RegistrationDate DATETIME2 DEFAULT GETUTCDATE(),
    LastLogin DATETIME2,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- User Profiles table
CREATE TABLE UserProfiles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Picture NVARCHAR(500),
    Locale NVARCHAR(10) DEFAULT 'es-ES',
    PhoneNumber NVARCHAR(20),
    Company NVARCHAR(200),
    Position NVARCHAR(100),
    Bio NTEXT,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- User Preferences table
CREATE TABLE UserPreferences (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Language NVARCHAR(10) DEFAULT 'es',
    Theme NVARCHAR(20) DEFAULT 'light',
    NotificationsEnabled BIT DEFAULT 1,
    EmailNotifications BIT DEFAULT 1,
    MarketingEmails BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IX_Users_AzureId ON Users(AzureId);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_UserProfiles_UserId ON UserProfiles(UserId);
CREATE INDEX IX_UserPreferences_UserId ON UserPreferences(UserId);
```

## Part 2: Azure Functions API Setup

### 2.1 Create Azure Function App
```bash
az functionapp create \
  --resource-group MessadEstudio \
  --consumption-plan-location "East US" \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name messad-estudio-api \
  --storage-account messadestudiostorage
```

### 2.2 Configure Connection Strings
Add these to your Function App Configuration:

```
SqlConnectionString = "Server=tcp:messad-estudio-sql-server.database.windows.net,1433;Initial Catalog=MessadEstudioDB;User ID=messadadmin;Password=YourSecurePassword123!;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

AzureAd_ClientId = "f8752e53-b8c4-41ce-abd3-0ccbcc85c8d3"
AzureAd_TenantId = "5645e8d8-96c8-418d-9a7b-f89f822073bd"
```

### 2.3 Example Azure Function Code

Create `functions/UserRegistration/index.js`:
```javascript
const { app } = require('@azure/functions');
const sql = require('mssql');

app.http('UserRegistration', {
    methods: ['GET', 'POST', 'PUT'],
    authLevel: 'anonymous',
    route: 'users/{action?}/{id?}',
    handler: async (request, context) => {
        const action = request.params.action || 'register';
        const userId = request.params.id;
        
        try {
            // Configure SQL connection
            const config = {
                server: process.env.SQL_SERVER,
                database: process.env.SQL_DATABASE,
                user: process.env.SQL_USER,
                password: process.env.SQL_PASSWORD,
                options: {
                    encrypt: true,
                    trustServerCertificate: false
                }
            };

            await sql.connect(config);

            switch (action) {
                case 'register':
                    return await registerUser(request);
                case 'profile':
                    return await getUserProfile(userId);
                case 'login':
                    return await updateLastLogin(userId);
                default:
                    return { status: 400, jsonBody: { success: false, message: 'Invalid action' } };
            }
        } catch (error) {
            context.log('Database error:', error);
            return { 
                status: 500, 
                jsonBody: { 
                    success: false, 
                    message: 'Internal server error' 
                } 
            };
        }
    }
});

async function registerUser(request) {
    const userData = await request.json();
    
    // Check if user already exists
    const existingUser = await sql.query`
        SELECT Id FROM Users WHERE AzureId = ${userData.azureId} OR Email = ${userData.email}
    `;
    
    if (existingUser.recordset.length > 0) {
        return { 
            status: 409, 
            jsonBody: { 
                success: false, 
                message: 'User already exists' 
            } 
        };
    }
    
    // Create new user
    const result = await sql.query`
        INSERT INTO Users (AzureId, Email, Name, Provider, RegistrationDate, LastLogin)
        OUTPUT INSERTED.Id
        VALUES (${userData.azureId}, ${userData.email}, ${userData.name}, ${userData.provider}, GETUTCDATE(), GETUTCDATE())
    `;
    
    const newUserId = result.recordset[0].Id;
    
    // Create user profile
    await sql.query`
        INSERT INTO UserProfiles (UserId, FirstName, LastName, Picture, Locale)
        VALUES (${newUserId}, ${userData.profileData.firstName}, ${userData.profileData.lastName}, 
                ${userData.profileData.picture}, ${userData.profileData.locale})
    `;
    
    // Create user preferences
    await sql.query`
        INSERT INTO UserPreferences (UserId, Language, NotificationsEnabled)
        VALUES (${newUserId}, 'es', 1)
    `;
    
    return {
        status: 200,
        jsonBody: {
            success: true,
            user: {
                id: newUserId,
                ...userData,
                preferences: { language: 'es', notifications: true }
            },
            message: 'User registered successfully'
        }
    };
}

async function getUserProfile(azureId) {
    const result = await sql.query`
        SELECT u.*, up.FirstName, up.LastName, up.Picture, up.Locale, up.PhoneNumber, up.Company, up.Position, up.Bio,
               pr.Language, pr.Theme, pr.NotificationsEnabled, pr.EmailNotifications, pr.MarketingEmails
        FROM Users u
        LEFT JOIN UserProfiles up ON u.Id = up.UserId
        LEFT JOIN UserPreferences pr ON u.Id = pr.UserId
        WHERE u.AzureId = ${azureId}
    `;
    
    if (result.recordset.length === 0) {
        return { 
            status: 404, 
            jsonBody: { 
                success: false, 
                message: 'User not found' 
            } 
        };
    }
    
    const user = result.recordset[0];
    
    return {
        status: 200,
        jsonBody: {
            success: true,
            user: {
                id: user.Id,
                azureId: user.AzureId,
                email: user.Email,
                name: user.Name,
                provider: user.Provider,
                registrationDate: user.RegistrationDate,
                lastLogin: user.LastLogin,
                profileData: {
                    firstName: user.FirstName,
                    lastName: user.LastName,
                    picture: user.Picture,
                    locale: user.Locale,
                    phoneNumber: user.PhoneNumber,
                    company: user.Company,
                    position: user.Position,
                    bio: user.Bio
                },
                preferences: {
                    language: user.Language,
                    theme: user.Theme,
                    notifications: user.NotificationsEnabled,
                    emailNotifications: user.EmailNotifications,
                    marketingEmails: user.MarketingEmails
                }
            }
        }
    };
}

async function updateLastLogin(azureId) {
    await sql.query`
        UPDATE Users 
        SET LastLogin = GETUTCDATE() 
        WHERE AzureId = ${azureId}
    `;
    
    return {
        status: 200,
        jsonBody: {
            success: true,
            message: 'Last login updated'
        }
    };
}
```

## Part 3: Google Identity Provider Setup

### 3.1 Configure Google in Azure Entra External ID

1. **Go to Azure Portal** → Azure Entra External ID → External Identities → Identity providers

2. **Add Google identity provider:**
   - Click "Add Google"
   - Client ID: Get from Google Cloud Console
   - Client Secret: Get from Google Cloud Console

3. **Get Google OAuth credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://login.microsoftonline.com/te/{your-tenant-id}/oauth2/authresp`

### 3.2 Update User Flow
1. Go to **User flows** in Azure Entra External ID
2. Create new user flow or edit existing
3. Enable Google as identity provider
4. Configure attribute collection (name, email, etc.)

## Part 4: Update Frontend Configuration

### 4.1 Update `auth-config.js` for Google support:
```javascript
// Add Google-specific login request
const googleLoginRequest = {
    scopes: ["openid", "profile", "email"],
    prompt: "select_account",
    domainHint: "google.com" // This will prioritize Google sign-in
};
```

### 4.2 Update HTML for Google-specific flow
The login modal can now differentiate between Azure and Google flows.

## Part 5: Testing & Deployment

### 5.1 Test the complete flow:
1. User clicks "Login" → Modal appears
2. User can choose Azure (email/password) or Google
3. After authentication, user is registered in database
4. User profile is created and stored
5. Welcome message shows for new users
6. Returning users see personalized greeting

### 5.2 Production considerations:
- Set up proper SSL certificates
- Configure CORS policies
- Set up monitoring and logging
- Implement rate limiting
- Add data backup strategies

## Next Steps
1. Deploy Azure SQL Database
2. Create and deploy Azure Functions
3. Configure Google OAuth in Google Cloud Console
4. Set up Google identity provider in Azure
5. Test the complete authentication flow
6. Monitor and optimize performance

This setup provides a complete, secure, and scalable authentication system with user registration, profile management, and Google sign-in integration.
