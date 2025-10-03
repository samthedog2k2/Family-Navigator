#!/bin/bash

echo "Fixing internal server error..."

# Kill any running servers
pkill -9 node

# Remove corrupted files
rm -rf .next
rm -rf node_modules
rm package-lock.json

# Reinstall everything
npm install

# Clear cache
npm cache clean --force

echo ""
echo "Reinstallation complete. Now run:"
echo "npm run dev"
