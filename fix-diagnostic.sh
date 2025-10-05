#!/bin/bash

# ==================================================================================
# Firebase Website Complete Diagnostic & Fix Script
# Advanced debugging with comprehensive error reporting
# ==================================================================================

set +e  # Don't exit on errors - we want to capture them all

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

REPORT_FILE="fix_report_$(date +%Y%m%d_%H%M%S).txt"
ERROR_COUNT=0
WARNING_COUNT=0

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Firebase Website Complete Fix & Diagnostic Script         ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Logging all output to: $REPORT_FILE"
echo ""

{
    echo "FIREBASE WEBSITE FIX REPORT"
    echo "Generated: $(date)"
    echo "========================================================================"
    echo ""
} > "$REPORT_FILE"

# ==================================================================================
# STEP 1: ENVIRONMENT CHECK
# ==================================================================================
echo -e "${BLUE}[STEP 1/10]${NC} Environment Check"
{
    echo ""
    echo "STEP 1: ENVIRONMENT CHECK"
    echo "========================================================================"
    echo "Current working directory: $(pwd)"
    echo "Current user: $(whoami)"
    echo "Node version: $(node --version 2>&1)"
    echo "NPM version: $(npm --version 2>&1)"
    echo ""
} | tee -a "$REPORT_FILE"

# ==================================================================================
# STEP 2: LOCATE PROJECT
# ==================================================================================
echo -e "${BLUE}[STEP 2/10]${NC} Locating Family-Navigator Project"
echo "" | tee -a "$REPORT_FILE"
echo "STEP 2: PROJECT LOCATION" | tee -a "$REPORT_FILE"
echo "========================================================================" | tee -a "$REPORT_FILE"

if [ -d "/home/user/studio/Family-Navigator" ]; then
    echo "✅ Found: /home/user/studio/Family-Navigator" | tee -a "$REPORT_FILE"
    PROJECT_DIR="/home/user/studio/Family-Navigator"
elif [ -d "Family-Navigator" ]; then
    echo "✅ Found: $(pwd)/Family-Navigator" | tee -a "$REPORT_FILE"
    PROJECT_DIR="$(pwd)/Family-Navigator"
elif [ -f "package.json" ] && grep -q "nextn" package.json; then
    echo "✅ Found: Current directory appears to be the project" | tee -a "$REPORT_FILE"
    PROJECT_DIR="$(pwd)"
else
    echo "❌ ERROR: Cannot locate Family-Navigator project directory!" | tee -a "$REPORT_FILE"
    ERROR_COUNT=$((ERROR_COUNT + 1))
    PROJECT_DIR=""
fi

echo "Project directory: $PROJECT_DIR" | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"

if [ -z "$PROJECT_DIR" ]; then
    echo -e "${RED}FATAL: Cannot proceed without project directory${NC}"
    exit 1
fi

# ==================================================================================
# STEP 3: CHECK FOR DUPLICATE FILES
# ==================================================================================
echo -e "${BLUE}[STEP 3/10]${NC} Checking for Duplicate Configuration Files"
{
    echo ""
    echo "STEP 3: DUPLICATE FILE CHECK"
    echo "========================================================================"

    PARENT_DIR=$(dirname "$PROJECT_DIR")

    if [ -f "$PARENT_DIR/package.json" ]; then
        echo "⚠️  WARNING: Found package.json in parent directory: $PARENT_DIR/package.json"
        WARNING_COUNT=$((WARNING_COUNT + 1))

        echo "   Content preview:"
        head -5 "$PARENT_DIR/package.json" | sed 's/^/   /'

        echo ""
        echo "   This duplicate file causes Firebase Studio to start from wrong directory"
        echo "   Removing: $PARENT_DIR/package.json"
        rm -f "$PARENT_DIR/package.json" && echo "   ✅ Removed" || echo "   ❌ Failed to remove"
    else
        echo "✅ No duplicate package.json in parent directory"
    fi

    if [ -f "$PARENT_DIR/package-lock.json" ]; then
        echo "⚠️  WARNING: Found package-lock.json in parent: $PARENT_DIR/package-lock.json"
        echo "   Removing: $PARENT_DIR/package-lock.json"
        rm -f "$PARENT_DIR/package-lock.json" && echo "   ✅ Removed" || echo "   ❌ Failed to remove"
    fi

    echo ""
} | tee -a "$REPORT_FILE"

# ==================================================================================
# STEP 4: VERIFY PROJECT STRUCTURE
# ==================================================================================
echo -e "${BLUE}[STEP 4/10]${NC} Verifying Project Structure"
{
    echo ""
    echo "STEP 4: PROJECT STRUCTURE VERIFICATION"
    echo "========================================================================"

    cd "$PROJECT_DIR" || exit 1
    echo "Changed to: $(pwd)"
    echo ""

    # Check critical files
    echo "Critical files check:"
    [ -f "package.json" ] && echo "  ✅ package.json" || { echo "  ❌ package.json MISSING"; ERROR_COUNT=$((ERROR_COUNT + 1)); }
    [ -f "next.config.js" ] && echo "  ✅ next.config.js" || { echo "  ❌ next.config.js MISSING"; ERROR_COUNT=$((ERROR_COUNT + 1)); }
    [ -f "tsconfig.json" ] && echo "  ✅ tsconfig.json" || { echo "  ❌ tsconfig.json MISSING"; ERROR_COUNT=$((ERROR_COUNT + 1)); }
    [ -f ".env.local" ] && echo "  ✅ .env.local" || { echo "  ⚠️  .env.local MISSING"; WARNING_COUNT=$((WARNING_COUNT + 1)); }

    echo ""
    echo "Critical directories check:"
    [ -d "src" ] && echo "  ✅ src/" || { echo "  ❌ src/ MISSING"; ERROR_COUNT=$((ERROR_COUNT + 1)); }
    [ -d "src/app" ] && echo "  ✅ src/app/" || { echo "  ❌ src/app/ MISSING"; ERROR_COUNT=$((ERROR_COUNT + 1)); }
    [ -f "src/app/page.tsx" ] && echo "  ✅ src/app/page.tsx" || { echo "  ❌ src/app/page.tsx MISSING"; ERROR_COUNT=$((ERROR_COUNT + 1)); }
    [ -d "node_modules" ] && echo "  ✅ node_modules/" || { echo "  ⚠️  node_modules/ MISSING"; WARNING_COUNT=$((WARNING_COUNT + 1)); }
    [ -d "node_modules/next" ] && echo "  ✅ node_modules/next/" || { echo "  ❌ node_modules/next/ MISSING"; ERROR_COUNT=$((ERROR_COUNT + 1)); }

    echo ""
} | tee -a "$REPORT_FILE"

# ==================================================================================
# STEP 5: CHECK PACKAGE.JSON DEV SCRIPT
# ==================================================================================
echo -e "${BLUE}[STEP 5/10]${NC} Checking package.json Dev Script"
{
    echo ""
    echo "STEP 5: DEV SCRIPT CHECK"
    echo "========================================================================"

    if [ -f "package.json" ]; then
        echo "Current dev script:"
        DEV_SCRIPT=$(grep '"dev"' package.json || echo "NOT FOUND")
        echo "  $DEV_SCRIPT"
        echo ""

        if echo "$DEV_SCRIPT" | grep -q 'node node_modules/next/dist/bin/next dev'; then
            echo "✅ Dev script is correct (calls Next.js directly via node)"
        elif echo "$DEV_SCRIPT" | grep -q '"dev": "next dev'; then
            echo "❌ Dev script is INCORRECT - uses 'next' command directly"
            ERROR_COUNT=$((ERROR_COUNT + 1))
            echo ""
            echo "Fixing dev script..."

            # Fix the dev script
            if sed -i.backup 's/"dev": "next dev/"dev": "node node_modules\/next\/dist\/bin\/next dev/g' package.json; then
                echo "✅ Dev script fixed"
                echo ""
                echo "New dev script:"
                grep '"dev"' package.json
            else
                echo "❌ Failed to fix dev script"
                ERROR_COUNT=$((ERROR_COUNT + 1))
            fi
        else
            echo "⚠️  WARNING: Unrecognized dev script format"
            WARNING_COUNT=$((WARNING_COUNT + 1))
        fi
    else
        echo "❌ ERROR: package.json not found"
        ERROR_COUNT=$((ERROR_COUNT + 1))
    fi

    echo ""
} | tee -a "$REPORT_FILE"

# ==================================================================================
# STEP 6: CHECK ENVIRONMENT VARIABLES
# ==================================================================================
echo -e "${BLUE}[STEP 6/10]${NC} Checking Environment Variables"
{
    echo ""
    echo "STEP 6: ENVIRONMENT VARIABLES CHECK"
    echo "========================================================================"

    if [ -f ".env.local" ]; then
        echo "✅ .env.local exists"
        echo ""
        echo "Checking for placeholder values:"

        if grep -q "YOUR_SENDER_ID" .env.local; then
            echo "  ❌ Found placeholder: YOUR_SENDER_ID (needs real value)"
            ERROR_COUNT=$((ERROR_COUNT + 1))
        else
            echo "  ✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID appears set"
        fi

        if grep -q "YOUR_APP_ID" .env.local; then
            echo "  ❌ Found placeholder: YOUR_APP_ID (needs real value)"
            ERROR_COUNT=$((ERROR_COUNT + 1))
        else
            echo "  ✅ NEXT_PUBLIC_FIREBASE_APP_ID appears set"
        fi

        echo ""
        echo "Environment variables defined (values hidden):"
        grep -v "^#" .env.local | grep "=" | sed 's/=.*/=***/' || echo "  No variables found"

    else
        echo "❌ ERROR: .env.local not found"
        ERROR_COUNT=$((ERROR_COUNT + 1))
        echo ""
        echo "Firebase will not work without environment variables!"
        echo "Run the Firebase setup script to create .env.local"
    fi

    echo ""
} | tee -a "$REPORT_FILE"

# ==================================================================================
# STEP 7: CHECK CROSS-ORIGIN CONFIGURATION
# ==================================================================================
echo -e "${BLUE}[STEP 7/10]${NC} Checking Cross-Origin Configuration"
{
    echo ""
    echo "STEP 7: CROSS-ORIGIN CONFIGURATION"
    echo "========================================================================"

    if [ -f "next.config.js" ]; then
        if grep -q "allowedDevOrigins" next.config.js; then
            echo "✅ allowedDevOrigins already configured"
            echo ""
            echo "Configuration:"
            grep -A 3 "allowedDevOrigins" next.config.js | sed 's/^/  /'
        else
            echo "⚠️  WARNING: allowedDevOrigins not configured"
            WARNING_COUNT=$((WARNING_COUNT + 1))
            echo ""
            echo "Adding cross-origin fix to next.config.js..."

            # Backup
            cp next.config.js next.config.js.backup

            # Add before export statement
            if sed -i '/^export default nextConfig/i\
\
// Fix Firebase Studio cross-origin warnings\
if (process.env.NODE_ENV === "development") {\
  nextConfig.allowedDevOrigins = [\
    "*.cluster-kadnvepafzbgiwrf2a46powzly.cloudworkstations.dev"\
  ];\
}\
' next.config.js; then
                echo "✅ Cross-origin fix added"
            else
                echo "❌ Failed to add cross-origin fix"
                ERROR_COUNT=$((ERROR_COUNT + 1))
            fi
        fi
    else
        echo "❌ ERROR: next.config.js not found"
        ERROR_COUNT=$((ERROR_COUNT + 1))
    fi

    echo ""
} | tee -a "$REPORT_FILE"

# ==================================================================================
# STEP 8: CHECK NODE MODULES
# ==================================================================================
echo -e "${BLUE}[STEP 8/10]${NC} Checking Node Modules"
{
    echo ""
    echo "STEP 8: NODE MODULES CHECK"
    echo "========================================================================"

    if [ ! -d "node_modules" ]; then
        echo "❌ ERROR: node_modules directory not found"
        ERROR_COUNT=$((ERROR_COUNT + 1))
        echo ""
        echo "Installing dependencies..."
        if npm install; then
            echo "✅ Dependencies installed successfully"
        else
            echo "❌ Failed to install dependencies"
            ERROR_COUNT=$((ERROR_COUNT + 1))
        fi
    else
        echo "✅ node_modules exists"

        # Check critical packages
        echo ""
        echo "Critical packages:"
        [ -d "node_modules/next" ] && echo "  ✅ next" || { echo "  ❌ next MISSING"; ERROR_COUNT=$((ERROR_COUNT + 1)); }
        [ -d "node_modules/react" ] && echo "  ✅ react" || { echo "  ❌ react MISSING"; ERROR_COUNT=$((ERROR_COUNT + 1)); }
        [ -d "node_modules/react-dom" ] && echo "  ✅ react-dom" || { echo "  ❌ react-dom MISSING"; ERROR_COUNT=$((ERROR_COUNT + 1)); }

        if [ -f "node_modules/next/package.json" ]; then
            NEXT_VERSION=$(grep '"version"' node_modules/next/package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
            echo "  Next.js version: $NEXT_VERSION"
        fi
    fi

    echo ""
} | tee -a "$REPORT_FILE"

# ==================================================================================
# STEP 9: TEST BUILD COMPILATION
# ==================================================================================
echo -e "${BLUE}[STEP 9/10]${NC} Testing TypeScript Compilation"
{
    echo ""
    echo "STEP 9: TYPESCRIPT COMPILATION TEST"
    echo "========================================================================"

    if [ -f "tsconfig.json" ] && [ -d "node_modules/typescript" ]; then
        echo "Running: npx tsc --noEmit (checking for type errors)..."
        echo ""

        if npx tsc --noEmit 2>&1 | tee /tmp/tsc_output.txt; then
            echo ""
            echo "✅ TypeScript compilation successful (no errors)"
        else
            echo ""
            echo "❌ TypeScript compilation has errors:"
            cat /tmp/tsc_output.txt
            ERROR_COUNT=$((ERROR_COUNT + 1))
        fi
    else
        echo "⚠️  Skipping TypeScript check (not available)"
        WARNING_COUNT=$((WARNING_COUNT + 1))
    fi

    echo ""
} | tee -a "$REPORT_FILE"

# ==================================================================================
# STEP 10: KILL EXISTING PROCESSES AND TEST SERVER START
# ==================================================================================
echo -e "${BLUE}[STEP 10/10]${NC} Process Cleanup & Server Test"
{
    echo ""
    echo "STEP 10: PROCESS CLEANUP & SERVER TEST"
    echo "========================================================================"

    echo "Checking for running Node.js processes..."
    if pgrep -f "next dev" > /dev/null; then
        echo "  Found running Next.js processes"
        echo "  Killing processes..."
        pkill -9 -f "next dev" 2>/dev/null || true
        sleep 2
        echo "  ✅ Processes killed"
    else
        echo "  ✅ No running Next.js processes found"
    fi

    echo ""
    echo "Testing server startup (5 second test)..."
    echo ""

    # Start server in background
    timeout 5 npm run dev > /tmp/server_test.log 2>&1 &
    SERVER_PID=$!
    sleep 5

    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "✅ Server started successfully"
        kill $SERVER_PID 2>/dev/null
    else
        echo "❌ Server failed to start"
        ERROR_COUNT=$((ERROR_COUNT + 1))
    fi

    echo ""
    echo "Server test output:"
    cat /tmp/server_test.log

    echo ""
} | tee -a "$REPORT_FILE"

# ==================================================================================
# FINAL SUMMARY
# ==================================================================================
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     DIAGNOSTIC COMPLETE                                        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

{
    echo ""
    echo "FINAL SUMMARY"
    echo "========================================================================"
    echo "Errors found: $ERROR_COUNT"
    echo "Warnings found: $WARNING_COUNT"
    echo ""

    if [ $ERROR_COUNT -eq 0 ] && [ $WARNING_COUNT -eq 0 ]; then
        echo "✅ ALL CHECKS PASSED - Your project should work correctly"
        echo ""
        echo "Next steps:"
        echo "1. In Firebase Studio, stop any running preview"
        echo "2. Start the preview again"
        echo "3. Your website should load successfully"
    elif [ $ERROR_COUNT -eq 0 ]; then
        echo "✅ No critical errors, but $WARNING_COUNT warning(s) found"
        echo ""
        echo "Your project should work, but review warnings above"
    else
        echo "❌ $ERROR_COUNT critical error(s) found that must be fixed"
        echo ""
        echo "CRITICAL ISSUES TO FIX:"
        echo ""
    fi

    # List specific issues if any
    if [ $ERROR_COUNT -gt 0 ]; then
        echo "Review the full report above for detailed error information"
        echo ""
        echo "Common fixes needed:"
        echo "1. If node_modules missing: Run 'npm install'"
        echo "2. If .env.local has placeholders: Add real Firebase credentials"
        echo "3. If dev script wrong: Script attempted to fix automatically"
        echo "4. If src/app/page.tsx missing: Restore from backup or recreate"
    fi

    echo ""
    echo "Full diagnostic report saved to: $REPORT_FILE"
    echo ""

} | tee -a "$REPORT_FILE"

echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Copy the contents of $REPORT_FILE and share with Claude${NC}"
echo -e "${YELLOW}for additional troubleshooting if issues persist${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "To view full report: cat $REPORT_FILE"
echo ""
