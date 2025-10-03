#!/bin/bash

echo "🚀 STARTING FAST DEV SERVER - FIXED VERSION"
echo "==========================================="

# Ensure clean environment
export NODE_ENV=development
export FORCE_COLOR=1

# Kill any existing processes
pkill -f "next dev" || true
pkill -f "genkit" || true

# Wait for processes to die
sleep 2

echo "🔥 Starting Next.js development server..."

# Start with correct Next.js CLI arguments
npm run dev

