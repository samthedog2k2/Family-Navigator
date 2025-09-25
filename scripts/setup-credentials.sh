#!/bin/bash

# This script securely sets up website credentials and then tests them.

PROJECT_ID="studio-5461927014-a4c9a"
WEBSITE_NAME="Hulu"
SECRET_NAME_UPPER="HULU"

echo "🔐 Secure Credential Setup & Test for AI Agent: $WEBSITE_NAME"
echo "=========================================================="
echo ""
echo "This will guide you through setting up and testing credentials for $WEBSITE_NAME."
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

# --- Restart Server ---
echo "--- Restarting Server to Apply Changes ---"
echo "To apply these changes, the application server must be restarted."
echo "Please wait, this may take a moment..."
npm run restart &
RESTART_PID=$!
# Wait for server to be ready
# A more robust solution might check the port, but this is sufficient for dev
sleep 15
echo ""
echo "✅ Server restarted."
echo ""

# --- Run Test ---
echo "--- Running Automated Login Test ---"
echo "The agent will now attempt to log into $WEBSITE_NAME to verify credentials."
echo "This can take up to a minute..."
echo ""

# Set environment variables for the test script
export HULU_USERNAME=$USERNAME
export HULU_PASSWORD=$PASSWORD

# I am creating this test file to run your test.
# This is a temporary file that will be cleaned up.
cat > test-runner.ts << 'EOF'
import { secureWebsiteAgent } from './src/ai/flows/secure-website-agent';

async function runTest() {
  console.log('[TEST] Dispatching secure agent to log into Hulu...');
  try {
    const result = await secureWebsiteAgent({
      request: "Log into Hulu.com and find the account holder's name.",
    });
    console.log('\n\n--- TEST RESULT ---');
    console.log('✅ Agent Task Completed Successfully:');
    console.log(result.response);
    console.log('-------------------\n');
  } catch (error) {
    console.error('\n\n--- TEST FAILED ---');
    console.error('❌ An error occurred while running the agent test:', error);
    console.log('-------------------\n');
  }
}

runTest();
EOF

# Execute the test using tsx
npx tsx test-runner.ts

# Clean up the temporary test file
rm test-runner.ts

# Kill the server process we started
kill $RESTART_PID

echo ""
echo "✨ Test complete. Check the output above for the result."
echo "You can now start your server normally with 'npm run dev' to continue working."
echo ""
