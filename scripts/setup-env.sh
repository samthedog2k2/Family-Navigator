#!/bin/bash

# This script securely sets up the .env file with your credentials.

echo "--- Secure Credential Setup ---"

# Define the .env file path
ENV_FILE=".env"

# Remove existing .env file to start fresh
if [ -f "$ENV_FILE" ]; then
  rm "$ENV_FILE"
  echo "✓ Removed existing .env file."
fi

# Prompt for Gemini API Key
echo -n "🔑 Please paste your Gemini API Key and press [ENTER]: "
read -r GEMINI_API_KEY
echo "GEMINI_API_KEY=$GEMINI_API_KEY" > "$ENV_FILE"

# Prompt for Hulu Username
echo -n "👤 Please enter your Hulu Username (email) and press [ENTER]: "
read -r HULU_USERNAME
echo "HULU_USERNAME=$HULU_USERNAME" >> "$ENV_FILE"

# Prompt for Hulu Password (silently)
echo -n "🔒 Please enter your Hulu Password and press [ENTER]: "
read -s HULU_PASSWORD
echo "" # Add a newline for better formatting
echo "HULU_PASSWORD=$HULU_PASSWORD" >> "$ENV_FILE"

echo ""
echo "✅ Success! Your credentials have been written to the .env file."
echo "The server will now restart to load the new credentials."

# Restart the server to apply the new environment variables
npm run restart
