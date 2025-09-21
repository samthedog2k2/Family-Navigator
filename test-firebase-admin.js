// This script is for testing server-side Firebase Admin connectivity.
// It requires the GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable to be set.
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

async function runTest() {
  console.log("Starting Firebase Admin SDK connectivity test...");

  // 1. Check for credentials
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    console.error("❌ Error: GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set.");
    console.error("Please set this variable with the JSON content of your service account key.");
    process.exit(1);
  }

  try {
    // 2. Initialize Firebase Admin App
    const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    
    // Check if the app is already initialized to prevent errors
    let app;
    try {
        app = initializeApp({
            credential: cert(serviceAccount)
        });
    } catch (e) {
        // App likely already exists, which is fine.
        console.log("Firebase Admin App may already be initialized.");
    }

    const db = getFirestore();
    console.log("Firebase Admin App initialized successfully.");

    // 3. Perform a test write and read
    const testDocRef = db.collection('admin-health-check').doc('test-doc');
    const testData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      sdk: 'firebase-admin'
    };

    console.log(`Attempting to write to Firestore at: ${testDocRef.path}`);
    await testDocRef.set(testData);
    console.log("Write successful.");

    console.log("Attempting to read from Firestore...");
    const docSnap = await testDocRef.get();

    if (docSnap.exists) {
      console.log("Read successful. Data:", docSnap.data());
      console.log("\n✅  Conclusion: Firebase Admin SDK connectivity is working correctly!");
      process.exit(0);
    } else {
      throw new Error("Test document not found after writing.");
    }
  } catch (error) {
    console.error("❌ Firebase Admin SDK Test Failed:", error.message);
    console.error("\n❌ Conclusion: Could not connect to Firestore using Admin credentials.");
    console.error("   Please check the following:");
    console.error("   1. Your GOOGLE_APPLICATION_CREDENTIALS_JSON is valid and has not expired.");
    console.error("   2. The service account has the 'Cloud Datastore User' or 'Editor' role in GCP IAM.");
    console.error("   3. Your machine has a stable internet connection to Firestore services.");
    process.exit(1);
  }
}

runTest();
