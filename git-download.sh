#!/bin/bash

# Family Navigator - Download from GitHub
# Location: ~/studio/Family-Navigator/git-download.sh

echo "=========================================="
echo "  Family Navigator - DOWNLOAD FROM GITHUB"
echo "=========================================="
echo ""

cd ~/studio/Family-Navigator || { echo "Error: Directory not found"; exit 1; }

# Check if git is initialized
if [ ! -d .git ]; then
    echo "No git repository found. Run git-upload.sh first."
    exit 1
fi

# Create backup of current state
BACKUP_DIR="backup-$(date '+%Y%m%d-%H%M%S')"
echo "Creating backup: $BACKUP_DIR"
mkdir -p "../$BACKUP_DIR"
cp -r . "../$BACKUP_DIR/" 2>/dev/null

# Fetch and pull latest
echo ""
echo "Fetching latest from GitHub..."
echo "You will be prompted for:"
echo "  Username: samthedog2k2"
echo "  Password: [your GitHub token]"
echo ""

git fetch origin

# Check for conflicts
if git diff --quiet HEAD origin/main; then
    echo "Already up to date."
else
    echo ""
    echo "Changes detected. Pulling..."
    git pull origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ SUCCESS - Files downloaded from GitHub"
        echo "✓ Backup saved at: ../$BACKUP_DIR"
    else
        echo ""
        echo "✗ Download failed - may have conflicts"
        echo "Your files are backed up at: ../$BACKUP_DIR"
    fi
fi
