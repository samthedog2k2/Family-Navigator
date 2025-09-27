#!/bin/bash

# This script will remove the corrupted node_modules directory and package-lock.json,
# and then perform a clean installation of all dependencies.

echo "--- Clearing corrupted npm cache and modules ---"
rm -rf node_modules package-lock.json .next

echo "--- Reinstalling all dependencies ---"
npm install

echo "--- Reinstallation complete. Please restart the application. ---"
