#!/bin/bash

# Test script for Messad Estudio Authentication System

echo "🧪 Testing Messad Estudio Authentication System..."
echo "================================================"

# Test 1: Check if backend dependencies are installed
echo "1. Checking backend dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ❌ Backend dependencies not found"
    echo "   Run: cd backend && npm install"
    exit 1
fi

# Test 2: Check if .env file exists
echo "2. Checking environment configuration..."
if [ -f "backend/.env" ]; then
    echo "   ✅ Environment file exists"
else
    echo "   ❌ Environment file not found"
    echo "   Run: cp backend/.env.example backend/.env"
    exit 1
fi

# Test 3: Check if MongoDB is available (optional)
echo "3. Checking database connection..."
if command -v mongod &> /dev/null; then
    echo "   ✅ MongoDB found locally"
elif grep -q "mongodb+srv" backend/.env; then
    echo "   ✅ MongoDB Atlas configured"
else
    echo "   ⚠️  No MongoDB detected - configure in backend/.env"
fi

# Test 4: Check if Google OAuth is configured
echo "4. Checking Google OAuth configuration..."
if grep -q "your-google-client-id" backend/.env; then
    echo "   ⚠️  Google OAuth not configured (optional)"
    echo "      Update GOOGLE_CLIENT_ID in backend/.env"
else
    echo "   ✅ Google OAuth appears configured"
fi

# Test 5: Check frontend auth script
echo "5. Checking frontend authentication..."
if [ -f "js/simple-auth.js" ]; then
    echo "   ✅ Frontend auth script exists"
else
    echo "   ❌ Frontend auth script missing"
    exit 1
fi

# Test 6: Try to start backend (briefly)
echo "6. Testing backend startup..."
cd backend
timeout 5s npm start > /dev/null 2>&1 &
sleep 2

# Test if backend is responding
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "   ✅ Backend starts successfully"
    # Kill the test server
    pkill -f "node server.js" 2>/dev/null
else
    echo "   ⚠️  Backend test incomplete (may need MongoDB running)"
    pkill -f "node server.js" 2>/dev/null
fi

cd ..

echo ""
echo "🎉 Setup Test Complete!"
echo ""
echo "Next steps:"
echo "1. Configure MongoDB (local or Atlas)"
echo "2. Set up Google OAuth (optional)"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Open website with Live Server"
echo "5. Test login functionality"
echo ""
echo "For detailed instructions, see: QUICK_START.md"
