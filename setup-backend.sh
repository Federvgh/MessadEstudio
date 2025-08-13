#!/bin/bash

# Messad Estudio Backend Setup Script

echo "🏗️  Setting up Messad Estudio Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16+) first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB found: $(mongod --version | head -n1)"
else
    echo "⚠️  MongoDB not found locally. You can use MongoDB Atlas instead."
fi

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your actual configuration:"
    echo "   - MongoDB connection string"
    echo "   - Google OAuth credentials"
    echo "   - JWT secret"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your configuration"
echo "2. Set up Google OAuth credentials"
echo "3. Start MongoDB (if using locally)"
echo "4. Run the backend: cd backend && npm run dev"
echo ""
echo "For detailed setup instructions, see: backend/README.md"
