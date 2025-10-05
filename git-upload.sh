#!/bin/bash

# Family Navigator - Upload to GitHub
# Location: ~/studio/Family-Navigator/git-upload.sh

echo "=========================================="
echo "  Family Navigator - UPLOAD TO GITHUB"
echo "=========================================="
echo ""

cd ~/studio/Family-Navigator || { echo "Error: Directory not found"; exit 1; }

# Create/update .gitignore
cat > .gitignore << 'EOF'
node_modules/
/.next/
/out/
.env
.env*.local
.firebase/
firebase-debug.log
.DS_Store
*.log
*.backup
.cache/
dist/
build/
.vscode/
.idea/
EOF

# Initialize git if needed
if [ ! -d .git ]; then
    echo "Initializing Git repository..."
    git init
    git config user.email "samthedog2k2@gmail.com"
    git config user.name "Adam"
    git branch -M main
fi

# Stage all changes
echo "Staging files..."
git add .

# Commit with timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "Creating commit: Backup - $TIMESTAMP"
git commit -m "Backup - $TIMESTAMP" || echo "No changes to commit"

# Check if remote exists
if ! git remote | grep -q 'origin'; then
    echo ""
    echo "Adding GitHub remote..."
    read -p "Enter GitHub username [samthedog2k2]: " USERNAME
    USERNAME=${USERNAME:-samthedog2k2}
    
    git remote add origin https://github.com/$USERNAME/Family-Navigator.git
fi

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
echo "You will be prompted for:"
echo "  Username: samthedog2k2"
echo "  Password: [your GitHub token]"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ SUCCESS - Files uploaded to GitHub"
    echo "✓ https://github.com/samthedog2k2/Family-Navigator"
else
    echo ""
    echo "✗ Upload failed - check credentials"
fi
