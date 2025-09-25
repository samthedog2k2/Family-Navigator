#!/bin/bash

# This script securely sets up website credentials for the AI agent.

PROJECT_ID="studio-5461927014-a4c9a"
WEBSITE_NAME="Hulu"
SECRET_NAME_UPPER="HULU"

echo "🔐 Secure Credential Setup for AI Agent: $WEBSITE_NAME"
echo "======================================================"
echo ""
echo "This will guide you through setting up credentials for $WEBSITE_NAME."
echo "Your password will not be displayed as you type."
echo ""

# --- Get Credentials ---
read -p "› Enter your $WEBSITE_NAME username/email: " USERNAME
read -s -p "› Enter your $WEBSITE_NAME password: " PASSWORD
echo "" # Newline after password input
echo ""

if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ]; then
  echo "❌ Username and password cannot be empty. Aborting."
  exit 1
fi

# --- Set Up Secrets ---

echo "--- Configuring Google Cloud Secret Manager ---"

# Delete old secrets if they exist, ignoring "not found" errors
echo "› Removing old ${SECRET_NAME_UPPER}_USERNAME secret (if any)..."
gcloud secrets delete "${SECRET_NAME_UPPER}_USERNAME" --project="$PROJECT_ID" --quiet 2>/dev/null || true

echo "› Removing old ${SECRET_NAME_UPPER}_PASSWORD secret (if any)..."
gcloud secrets delete "${SECRET_NAME_UPPER}_PASSWORD" --project="$PROJECT_ID" --quiet 2>/dev/null || true


# Create and set username
echo "› Creating new secret for username..."
gcloud secrets create "${SECRET_NAME_UPPER}_USERNAME" --replication-policy="automatic" --project="$PROJECT_ID"
echo -n "$USERNAME" | gcloud secrets versions add "${SECRET_NAME_UPPER}_USERNAME" --data-file=- --project="$PROJECT_ID"

# Create and set password
echo "› Creating new secret for password..."
gcloud secrets create "${SECRET_NAME_UPPER}_PASSWORD" --replication-policy="automatic" --project="$PROJECT_ID"
echo -n "$PASSWORD" | gcloud secrets versions add "${SECRET_NAME_UPPER}_PASSWORD" --data-file=- --project="$PROJECT_ID"

echo ""
echo "✅ Success! Your $WEBSITE_NAME credentials have been securely stored."
echo ""

# --- Final Instruction ---
echo "--- Final Step: Restart the Server ---"
echo "To apply these changes, you must restart your application server."
echo "Run the following command in your terminal:"
echo ""
echo "  npm run restart"
echo ""
