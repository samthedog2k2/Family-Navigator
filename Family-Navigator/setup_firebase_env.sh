#!/bin/bash

# ==================================================================================
# Firebase Environment Configuration Setup Script
# Interactive script to help set up your .env.local file
# ==================================================================================

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Firebase Environment Configuration Setup                   ║${NC}"
echo -e "${CYAN}║     Interactive Setup for .env.local                           ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Working directory: $(pwd)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in current directory!${NC}"
    echo "Please run this script from your Family-Navigator project root"
    exit 1
fi

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local already exists!${NC}"
    echo ""
    echo "Current content:"
    cat .env.local
    echo ""
    echo -e "${YELLOW}Do you want to:${NC}"
    echo "  1) Overwrite it completely"
    echo "  2) Add missing variables only"
    echo "  3) Exit and keep current file"
    echo ""
    read -p "Choose option (1/2/3): " option
    
    case $option in
        1)
            echo -e "${YELLOW}Creating backup...${NC}"
            cp .env.local ".env.local.backup.$(date +%Y%m%d_%H%M%S)"
            echo -e "${GREEN}✅ Backup created${NC}"
            ;;
        2)
            echo -e "${BLUE}Will append missing variables...${NC}"
            APPEND_MODE=true
            ;;
        3)
            echo -e "${GREEN}Exiting...${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Exiting.${NC}"
            exit 1
            ;;
    esac
    echo ""
fi

# Guide user to Firebase Console
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}STEP 1: Get Firebase Web App Configuration${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "📋 Instructions:"
echo ""
echo "1. Open Firebase Console: https://console.firebase.google.com/"
echo "2. Select your project (or create one)"
echo "3. Click ⚙️  (Settings) → Project settings"
echo "4. Scroll to 'Your apps' section"
echo "5. If you have a web app, click it. If not, click 'Add app' → Web"
echo "6. You'll see a config object with these values:"
echo ""
echo -e "${CYAN}   const firebaseConfig = {${NC}"
echo -e "${CYAN}     apiKey: \"...\",${NC}"
echo -e "${CYAN}     authDomain: \"...\",${NC}"
echo -e "${CYAN}     projectId: \"...\",${NC}"
echo -e "${CYAN}     storageBucket: \"...\",${NC}"
echo -e "${CYAN}     messagingSenderId: \"...\",${NC}"
echo -e "${CYAN}     appId: \"...\"${NC}"
echo -e "${CYAN}   };${NC}"
echo ""
echo -e "${GREEN}Press ENTER when you have the Firebase Console open...${NC}"
read

# Collect Client SDK Configuration
echo ""
echo -e "${BLUE}Enter your Firebase Web App configuration:${NC}"
echo ""

read -p "API Key (starts with 'AIza'): " api_key
read -p "Auth Domain (ends with '.firebaseapp.com'): " auth_domain
read -p "Project ID: " project_id
read -p "Storage Bucket (ends with '.appspot.com'): " storage_bucket
read -p "Messaging Sender ID (numeric): " sender_id
read -p "App ID (format: 1:xxx:web:xxx): " app_id

# Ask about Admin SDK
echo ""
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}STEP 2: Get Firebase Admin SDK Credentials (Optional)${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Admin SDK is needed for server-side operations."
echo ""
echo -e "${YELLOW}Do you want to configure Admin SDK now? (y/n)${NC}"
read -p "Choice: " admin_choice

if [[ "$admin_choice" =~ ^[Yy]$ ]]; then
    echo ""
    echo "📋 Instructions for Admin SDK:"
    echo ""
    echo "1. In Firebase Console, go to ⚙️  Settings → Project settings"
    echo "2. Click 'Service accounts' tab"
    echo "3. Click 'Generate new private key'"
    echo "4. Click 'Generate key' to download JSON file"
    echo "5. Open the downloaded JSON file"
    echo ""
    echo -e "${GREEN}Press ENTER when you have the JSON file open...${NC}"
    read
    
    echo ""
    echo -e "${BLUE}Enter Admin SDK credentials from the JSON file:${NC}"
    echo ""
    
    read -p "Project ID (from JSON): " admin_project_id
    read -p "Client Email (ends with .iam.gserviceaccount.com): " client_email
    echo ""
    echo "Private Key (paste entire key including BEGIN/END lines):"
    echo "Press CTRL+D when done pasting:"
    private_key=$(cat)
    
    # Convert newlines to \n for .env format
    private_key=$(echo "$private_key" | awk '{printf "%s\\n", $0}' | sed 's/\\n$//')
    
    USE_ADMIN=true
else
    echo -e "${YELLOW}Skipping Admin SDK configuration${NC}"
    USE_ADMIN=false
fi

# Create .env.local file
echo ""
echo -e "${BLUE}Creating .env.local file...${NC}"

if [ "$APPEND_MODE" = true ]; then
    ENV_FILE=".env.local"
    echo "" >> "$ENV_FILE"
    echo "# Added by setup script on $(date)" >> "$ENV_FILE"
else
    ENV_FILE=".env.local"
    cat > "$ENV_FILE" << ENV_HEADER
# ==================================================================================
# Firebase Configuration - Family Navigator
# Generated: $(date)
# ==================================================================================
# 
# ⚠️  IMPORTANT SECURITY NOTES:
# - Never commit this file to Git
# - NEXT_PUBLIC_* variables are exposed to browsers (safe)
# - FIREBASE_PRIVATE_KEY must remain server-side only
# 
# ==================================================================================
ENV_HEADER
fi

# Write client SDK config
{
    echo ""
    echo "# =================================================================================="
    echo "# Firebase Client SDK - Public (Browser-Safe)"
    echo "# =================================================================================="
    echo "NEXT_PUBLIC_FIREBASE_API_KEY=$api_key"
    echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$auth_domain"
    echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$project_id"
    echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$storage_bucket"
    echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$sender_id"
    echo "NEXT_PUBLIC_FIREBASE_APP_ID=$app_id"
} >> "$ENV_FILE"

# Write admin SDK config if provided
if [ "$USE_ADMIN" = true ]; then
    {
        echo ""
        echo "# ==========================================================

# Change to the correct project directory
cd /home/user/studio/Family-Navigator

# Now run the Firebase setup script
cat > setup_firebase_env.sh << 'SCRIPT_EOF'
#!/bin/bash

# ==================================================================================
# Firebase Environment Configuration Setup Script
# Interactive script to help set up your .env.local file
# ==================================================================================

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Firebase Environment Configuration Setup                   ║${NC}"
echo -e "${CYAN}║     Interactive Setup for .env.local                           ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Working directory: $(pwd)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in current directory!${NC}"
    echo "Please run this script from your Family-Navigator project root"
    exit 1
fi

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local already exists!${NC}"
    echo ""
    echo "Current content:"
    cat .env.local
    echo ""
    echo -e "${YELLOW}Do you want to:${NC}"
    echo "  1) Overwrite it completely"
    echo "  2) Add missing variables only"
    echo "  3) Exit and keep current file"
    echo ""
    read -p "Choose option (1/2/3): " option
    
    case $option in
        1)
            echo -e "${YELLOW}Creating backup...${NC}"
            cp .env.local ".env.local.backup.$(date +%Y%m%d_%H%M%S)"
            echo -e "${GREEN}✅ Backup created${NC}"
            ;;
        2)
            echo -e "${BLUE}Will append missing variables...${NC}"
            APPEND_MODE=true
            ;;
        3)
            echo -e "${GREEN}Exiting...${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Exiting.${NC}"
            exit 1
            ;;
    esac
    echo ""
fi

# Guide user to Firebase Console
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}STEP 1: Get Firebase Web App Configuration${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "📋 Instructions:"
echo ""
echo "1. Open Firebase Console: https://console.firebase.google.com/"
echo "2. Select your project (or create one)"
echo "3. Click ⚙️  (Settings) → Project settings"
echo "4. Scroll to 'Your apps' section"
echo "5. If you have a web app, click it. If not, click 'Add app' → Web"
echo "6. You'll see a config object with these values:"
echo ""
echo -e "${CYAN}   const firebaseConfig = {${NC}"
echo -e "${CYAN}     apiKey: \"...\",${NC}"
echo -e "${CYAN}     authDomain: \"...\",${NC}"
echo -e "${CYAN}     projectId: \"...\",${NC}"
echo -e "${CYAN}     storageBucket: \"...\",${NC}"
echo -e "${CYAN}     messagingSenderId: \"...\",${NC}"
echo -e "${CYAN}     appId: \"...\"${NC}"
echo -e "${CYAN}   };${NC}"
echo ""
echo -e "${GREEN}Press ENTER when you have the Firebase Console open...${NC}"
read

# Collect Client SDK Configuration
echo ""
echo -e "${BLUE}Enter your Firebase Web App configuration:${NC}"
echo ""

read -p "API Key (starts with 'AIza'): " api_key
read -p "Auth Domain (ends with '.firebaseapp.com'): " auth_domain
read -p "Project ID: " project_id
read -p "Storage Bucket (ends with '.appspot.com'): " storage_bucket
read -p "Messaging Sender ID (numeric): " sender_id
read -p "App ID (format: 1:xxx:web:xxx): " app_id

# Ask about Admin SDK
echo ""
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}STEP 2: Get Firebase Admin SDK Credentials (Optional)${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Admin SDK is needed for server-side operations."
echo ""
echo -e "${YELLOW}Do you want to configure Admin SDK now? (y/n)${NC}"
read -p "Choice: " admin_choice

if [[ "$admin_choice" =~ ^[Yy]$ ]]; then
    echo ""
    echo "📋 Instructions for Admin SDK:"
    echo ""
    echo "1. In Firebase Console, go to ⚙️  Settings → Project settings"
    echo "2. Click 'Service accounts' tab"
    echo "3. Click 'Generate new private key'"
    echo "4. Click 'Generate key' to download JSON file"
    echo "5. Open the downloaded JSON file"
    echo ""
    echo -e "${GREEN}Press ENTER when you have the JSON file open...${NC}"
    read
    
    echo ""
    echo -e "${BLUE}Enter Admin SDK credentials from the JSON file:${NC}"
    echo ""
    
    read -p "Project ID (from JSON): " admin_project_id
    read -p "Client Email (ends with .iam.gserviceaccount.com): " client_email
    echo ""
    echo "Private Key (paste entire key including BEGIN/END lines):"
    echo "Press CTRL+D when done pasting:"
    private_key=$(cat)
    
    # Convert newlines to \n for .env format
    private_key=$(echo "$private_key" | awk '{printf "%s\\n", $0}' | sed 's/\\n$//')
    
    USE_ADMIN=true
else
    echo -e "${YELLOW}Skipping Admin SDK configuration${NC}"
    USE_ADMIN=false
fi

# Create .env.local file
echo ""
echo -e "${BLUE}Creating .env.local file...${NC}"

if [ "$APPEND_MODE" = true ]; then
    ENV_FILE=".env.local"
    echo "" >> "$ENV_FILE"
    echo "# Added by setup script on $(date)" >> "$ENV_FILE"
else
    ENV_FILE=".env.local"
    cat > "$ENV_FILE" << ENV_HEADER
# ==================================================================================
# Firebase Configuration - Family Navigator
# Generated: $(date)
# ==================================================================================
# 
# ⚠️  IMPORTANT SECURITY NOTES:
# - Never commit this file to Git
# - NEXT_PUBLIC_* variables are exposed to browsers (safe)
# - FIREBASE_PRIVATE_KEY must remain server-side only
# 
# ==================================================================================
ENV_HEADER
fi

# Write client SDK config
{
    echo ""
    echo "# =================================================================================="
    echo "# Firebase Client SDK - Public (Browser-Safe)"
    echo "# =================================================================================="
    echo "NEXT_PUBLIC_FIREBASE_API_KEY=$api_key"
    echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$auth_domain"
    echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$project_id"
    echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$storage_bucket"
    echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$sender_id"
    echo "NEXT_PUBLIC_FIREBASE_APP_ID=$app_id"
} >> "$ENV_FILE"

# Write admin SDK config if provided
if [ "$USE_ADMIN" = true ]; then
    {
        echo ""
        echo "# =================================================================================="
        echo "# Firebase Admin SDK - Private (Server-Side Only)"
        echo "# =================================================================================="
        echo "FIREBASE_PROJECT_ID=$admin_project_id"
        echo "FIREBASE_CLIENT_EMAIL=$client_email"
        echo "FIREBASE_PRIVATE_KEY=\"$private_key\""
    } >> "$ENV_FILE"
fi

# Add other common variables
{
    echo ""
    echo "# =================================================================================="
    echo "# Application Configuration"
    echo "# =================================================================================="
    echo "DATA_BACKEND=firebase"
    echo ""
} >> "$ENV_FILE"

echo -e "${GREEN}✅ .env.local created successfully!${NC}"

# Update .gitignore
echo ""
echo -e "${BLUE}Updating .gitignore...${NC}"

if [ -f ".gitignore" ]; then
    if ! grep -q ".env.local" .gitignore; then
        {
            echo ""
            echo "# Environment variables - DO NOT COMMIT"
            echo ".env*.local"
            echo ".env"
            echo "*.pem"
            echo "*.key"
        } >> .gitignore
        echo -e "${GREEN}✅ .gitignore updated${NC}"
    else
        echo -e "${GREEN}✅ .gitignore already configured${NC}"
    fi
else
    {
        echo "# Environment variables - DO NOT COMMIT"
        echo ".env*.local"
        echo ".env"
        echo "*.pem"
        echo "*.key"
    } > .gitignore
    echo -e "${GREEN}✅ .gitignore created${NC}"
fi

# Display summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Configuration Complete!                                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📁 Files created in: $(pwd)${NC}"
echo "   • .env.local (your Firebase configuration)"
echo "   • .gitignore (prevents committing secrets)"
echo ""

echo -e "${CYAN}🔧 Next Steps:${NC}"
echo ""
echo "1. Verify your configuration:"
echo -e "   ${YELLOW}cat .env.local${NC}"
echo ""
echo "2. Start your development server:"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Visit your app:"
echo -e "   ${YELLOW}http://localhost:3000${NC}"
echo ""

echo -e "${GREEN}✨ Setup complete! Your Firebase configuration is ready.${NC}"
echo ""
