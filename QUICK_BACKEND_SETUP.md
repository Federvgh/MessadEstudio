# Quick Azure Backend Setup for User Registration

## Priority 1: Azure SQL Database (Essential)

### Step 1: Create Azure SQL Database
```bash
# Create resource group (if not exists)
az group create --name MessadEstudio --location "East US"

# Create SQL Server
az sql server create \
  --name messad-estudio-sql \
  --resource-group MessadEstudio \
  --location "East US" \
  --admin-user messadadmin \
  --admin-password "MessadEstudio2024!"

# Create Database
az sql db create \
  --resource-group MessadEstudio \
  --server messad-estudio-sql \
  --name MessadEstudioDB \
  --service-objective Basic
```

### Step 2: Create User Tables
Connect to your database and run:
```sql
-- Users table
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    AzureId NVARCHAR(255) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Name NVARCHAR(255) NOT NULL,
    Provider NVARCHAR(50) NOT NULL DEFAULT 'microsoft',
    RegistrationDate DATETIME2 DEFAULT GETUTCDATE(),
    LastLogin DATETIME2 DEFAULT GETUTCDATE(),
    IsActive BIT DEFAULT 1
);

-- User Profiles table
CREATE TABLE UserProfiles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Picture NVARCHAR(500),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
```

## Priority 2: Simple Azure Function API

### Step 1: Create Function App
```bash
# Create storage account
az storage account create \
  --name messadestudiostorage \
  --resource-group MessadEstudio \
  --location "East US" \
  --sku Standard_LRS

# Create Function App
az functionapp create \
  --resource-group MessadEstudio \
  --consumption-plan-location "East US" \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name messad-estudio-api \
  --storage-account messadestudiostorage
```

### Step 2: Simple User API Function
Create this minimal function to handle user registration:

**File: `functions/UserAPI/index.js`**
```javascript
const { app } = require('@azure/functions');
const sql = require('mssql');

// Database configuration
const config = {
    server: 'messad-estudio-sql.database.windows.net',
    database: 'MessadEstudioDB',
    user: 'messadadmin',
    password: 'MessadEstudio2024!',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

app.http('UserAPI', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'users/{action?}/{id?}',
    handler: async (request, context) => {
        // Enable CORS
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };

        if (request.method === 'OPTIONS') {
            return { status: 200, headers };
        }

        try {
            await sql.connect(config);
            
            const action = request.params.action || 'register';
            const azureId = request.params.id;

            if (action === 'register' && request.method === 'POST') {
                return await registerUser(request, headers);
            } else if (action === 'profile' && azureId && request.method === 'GET') {
                return await getUserProfile(azureId, headers);
            }

            return { 
                status: 400, 
                headers,
                jsonBody: { success: false, message: 'Invalid request' } 
            };

        } catch (error) {
            context.log('Error:', error);
            return { 
                status: 500, 
                headers,
                jsonBody: { success: false, message: 'Server error' } 
            };
        }
    }
});

async function registerUser(request, headers) {
    const userData = await request.json();
    
    // Check if user exists
    const existing = await sql.query`
        SELECT Id FROM Users WHERE AzureId = ${userData.azureId}
    `;
    
    if (existing.recordset.length > 0) {
        // User exists, update last login
        await sql.query`
            UPDATE Users SET LastLogin = GETUTCDATE() WHERE AzureId = ${userData.azureId}
        `;
        
        const user = await sql.query`
            SELECT u.*, up.FirstName, up.LastName 
            FROM Users u
            LEFT JOIN UserProfiles up ON u.Id = up.UserId
            WHERE u.AzureId = ${userData.azureId}
        `;
        
        return {
            status: 200,
            headers,
            jsonBody: {
                success: true,
                user: user.recordset[0],
                message: 'Welcome back!'
            }
        };
    }
    
    // Create new user
    const result = await sql.query`
        INSERT INTO Users (AzureId, Email, Name, Provider)
        OUTPUT INSERTED.Id
        VALUES (${userData.azureId}, ${userData.email}, ${userData.name}, ${userData.provider || 'microsoft'})
    `;
    
    const userId = result.recordset[0].Id;
    
    // Create profile
    await sql.query`
        INSERT INTO UserProfiles (UserId, FirstName, LastName, Picture)
        VALUES (${userId}, ${userData.profileData?.firstName || ''}, 
                ${userData.profileData?.lastName || ''}, ${userData.profileData?.picture || ''})
    `;
    
    return {
        status: 200,
        headers,
        jsonBody: {
            success: true,
            user: {
                id: userId,
                azureId: userData.azureId,
                email: userData.email,
                name: userData.name,
                provider: userData.provider || 'microsoft',
                profileData: userData.profileData
            },
            message: 'Account created successfully!'
        }
    };
}

async function getUserProfile(azureId, headers) {
    const result = await sql.query`
        SELECT u.*, up.FirstName, up.LastName, up.Picture
        FROM Users u
        LEFT JOIN UserProfiles up ON u.Id = up.UserId
        WHERE u.AzureId = ${azureId}
    `;
    
    if (result.recordset.length === 0) {
        return { 
            status: 404, 
            headers,
            jsonBody: { success: false, message: 'User not found' } 
        };
    }
    
    return {
        status: 200,
        headers,
        jsonBody: {
            success: true,
            user: result.recordset[0]
        }
    };
}
```

### Step 3: Deploy Function
```bash
# Deploy the function
func azure functionapp publish messad-estudio-api
```

### Step 4: Update Frontend Configuration
Update `js/user-manager.js` to use your real API:

```javascript
// Change this line in user-manager.js:
this.apiBaseUrl = 'https://messad-estudio-api.azurewebsites.net/api';

// And modify the isDevelopmentMode function to return false:
isDevelopmentMode() {
    return false; // Changed from checking localhost
}
```

## Quick Test Process

1. **Set up the database** (15 minutes)
2. **Deploy the simple function** (10 minutes) 
3. **Update the API URL** (2 minutes)
4. **Test user registration** (immediate)

## Alternative: Quick Database-Only Setup

If Azure Functions seem complex, you can start with just the database and a simple PHP/Node.js script on any hosting service.

Would you like me to:
1. **Help you set up the Azure SQL Database first** (easiest starting point)
2. **Create a simpler database solution** (like using Supabase or Firebase)
3. **Set up the complete Azure Functions API** (full solution)

The authentication is working perfectly - we just need to connect it to a database to store the user profiles!
