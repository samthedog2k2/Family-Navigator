#!/usr/bin/env tsx

/**
 * Automated Test Runner for the Secure Website Agent.
 * This script loads credentials from .env and runs a test login.
 */
import 'dotenv/config';
import { secureWebsiteAgent } from '@/ai/flows/secure-website-agent';

async function runTest() {
  console.log("\n--- Running Automated Login Test ---");
  console.log("The agent will now attempt to log into Hulu to verify credentials.");
  console.log("This can take up to a minute...\n");

  if (!process.env.GEMINI_API_KEY || !process.env.HULU_USERNAME || !process.env.HULU_PASSWORD) {
    console.error("❌ ERROR: Missing one or more required variables in your .env file (GEMINI_API_KEY, HULU_USERNAME, HULU_PASSWORD).");
    console.error("Please run 'scripts/setup-env.sh' to configure them.");
    process.exit(1);
  }

  try {
    console.log("[TEST] Dispatching secure agent to log into Hulu...");
    const result = await secureWebsiteAgent({
      request: "Log into Hulu.com and find the account holder's name."
    });

    console.log("\n--- TEST COMPLETE ---");
    if (result.response && !result.response.toLowerCase().includes('error')) {
      console.log("✅ SUCCESS! The agent returned a valid response:");
      console.log(`\n    "${result.response}"\n`);
      console.log("This confirms your API key and credentials are working correctly.");
    } else {
      console.log("❌ TEST FAILED. The agent returned an error or an invalid response:");
      console.log(`\n    "${result.response}"\n`);
    }

  } catch (error) {
    console.error("\n--- TEST FAILED ---");
    console.error("❌ An unexpected error occurred while running the agent test:", error);
  } finally {
     console.log("\n✨ You can now start your server normally with 'npm run dev' to continue working.");
  }
}

runTest();
