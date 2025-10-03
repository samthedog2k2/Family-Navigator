#!/bin/bash

echo "🔄 FORCE RESTARTING DEVELOPMENT SERVER"
echo "======================================"

# Kill any existing Next.js processes
pkill -f "next dev" || true
pkill -f "node.*next" || true

# Wait a moment
sleep 2

# Clear cache again
rm -rf .next
rm -rf node_modules/.cache

echo "🚀 Starting fresh development server..."
npm run dev
