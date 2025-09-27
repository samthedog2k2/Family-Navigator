#!/bin/bash

# This script helps identify large files and directories to free up disk space.
# It is safe to run and will not delete any files.

echo "--- Analyzing Disk Usage in Home Directory ---"
echo ""

echo "--- Top 20 Largest Files & Directories ---"
# This command finds the largest items in your home directory.
# 'du' -> disk usage, 'sort' -> sorts by size, 'head' -> shows the top 20
du -ah ~ | sort -rh | head -n 20
echo ""

echo "--- Project-Specific Cache/Dependency Sizes ---"
echo "These are often the largest and are safe to delete (you can reinstall them)."

echo ""
echo "Size of node_modules:"
du -sh node_modules 2>/dev/null || echo "Not found."

echo ""
echo "Size of Next.js build cache (.next):"
du -sh .next 2>/dev/null || echo "Not found."
echo ""

echo "--- Analysis Complete ---"
echo "Recommendation: To quickly free up a lot of space, you can remove the 'node_modules' and '.next' directories."
echo "You can do this by running: rm -rf node_modules .next"
echo "Afterwards, run 'npm install' to reinstall your dependencies."
