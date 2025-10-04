#!/bin/bash

# ==================================================================================
# Firebase Configuration Checker
# Validates your .env.local file and Firebase setup
# ==================================================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔍 Firebase Configuration Checker"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local file not found!${NC}"
    echo ""
    echo "Please create .env.local from the template:"
    echo "  cp .env.local.template .env.local"
    echo ""
    echo "Then fill in your Firebase credentials."
    echo "See FIREBASE_SETUP.md for detailed instructions."
    exit 1
fi

echo -e "${GREEN}✅ .env.local file exists${NC}"
echo ""

# Function to check if variable is set and not a placeholder
check_var() {
    local var_name=$1
    local var_value=$(grep "^${var_name}=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")

    if [ -z "$var_value" ]; then
        echo -e "${RED}❌ $var_name is not set${NC}"
        return 1
    elif [[ "$var_value" == *"XXXX"* ]] || [[ "$var_value" == *"your-"* ]] || [[ "$var_value" == *"123456"* ]]; then
        echo -e "${YELLOW}⚠️  $var_name appears to be a placeholder${NC}"
        return 2
    else
        echo -e "${GREEN}✅ $var_name is set${NC}"
        return 0
    fi
}

echo "Checking required Firebase Client SDK variables:"
echo "------------------------------------------------"
check_var "NEXT_PUBLIC_FIREBASE_API_KEY"
check_var "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
check_var "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
check_var "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
check_var "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
check_var "NEXT_PUBLIC_FIREBASE_APP_ID"

echo ""
echo "Checking optional Firebase Admin SDK variables:"
echo "-----------------------------------------------"
admin_configured=true
check_var "FIREBASE_PROJECT_ID" || admin_configured=false
check_var "FIREBASE_CLIENT_EMAIL" || admin_configured=false
check_var "FIREBASE_PRIVATE_KEY" || check_var "GOOGLE_APPLICATION_CREDENTIALS_JSON" || admin_configured=false

echo ""
echo "Additional checks:"
echo "------------------"

# Check API key format
api_key=$(grep "^NEXT_PUBLIC_FIREBASE_API_KEY=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")
if [[ "$api_key" =~ ^AIza ]]; then
    echo -e "${GREEN}✅ API key has correct format${NC}"
else
    echo -e "${YELLOW}⚠️  API key should start with 'AIza'${NC}"
fi

# Check auth domain format
auth_domain=$(grep "^NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")
if [[ "$auth_domain" =~ firebaseapp\.com$ ]]; then
    echo -e "${GREEN}✅ Auth domain has correct format${NC}"
else
    echo -e "${YELLOW}⚠️  Auth domain should end with '.firebaseapp.com'${NC}"
fi

# Check storage bucket format
storage_bucket=$(grep "^NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")
if [[ "$storage_bucket" =~ appspot\.com$ ]] || [ -z "$storage_bucket" ]; then
    echo -e "${GREEN}✅ Storage bucket format looks correct${NC}"
else
    echo -e "${YELLOW}⚠️  Storage bucket should end with '.appspot.com'${NC}"
fi

# Check .gitignore
if grep -q ".env.local" .gitignore 2>/dev/null || grep -q ".env\*.local" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✅ .env.local is protected by .gitignore${NC}"
else
    echo -e "${RED}❌ .env.local is NOT in .gitignore! Add it to prevent committing secrets${NC}"
fi

echo ""
echo "Summary:"
echo "========"

if [ "$admin_configured" = true ]; then
    echo -e "${GREEN}✅ Client SDK configured${NC}"
    echo -e "${GREEN}✅ Admin SDK configured${NC}"
else
    echo -e "${GREEN}✅ Client SDK configured${NC}"
    echo -e "${YELLOW}⚠️  Admin SDK not configured (optional for some features)${NC}"
fi

echo ""
echo "Next steps:"
echo "-----------"
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Visit http://localhost:3000"
echo ""
echo "3. If you see errors, check:"
echo "   - Firebase Console: Enable Authentication and Firestore"
echo "   - Restart dev server after changing .env.local"
echo "   - See FIREBASE_SETUP.md for troubleshooting"
echo ""
