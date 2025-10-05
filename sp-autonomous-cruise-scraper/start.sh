#!/bin/bash

echo "SP Autonomous Cruise Scraper"
echo "==========================="

if [ "$1" = "schedule" ]; then
    echo "Starting scheduled collection (every 6 hours)..."
    node index.js --schedule
else
    echo "Running one-time collection..."
    node index.js
fi
