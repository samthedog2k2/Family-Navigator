#!/bin/bash

echo "�� STARTING FAST DEV SERVER - NO CRASHES"
echo "========================================"

# Ensure clean environment
export NODE_ENV=development
export FORCE_COLOR=1

# Kill any existing processes
pkill -f "next dev" || true
pkill -f "genkit" || true

# Wait for processes to die
sleep 2

echo "🔥 Starting optimized Next.js server..."

# Start with optimal settings for performance
npm run dev -- --port 3000 --hostname localhost --experimental-https false

