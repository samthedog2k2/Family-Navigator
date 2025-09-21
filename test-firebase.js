import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

const app = initializeApp(config);
const db = getFirestore(app);

async function runTest() {
  try {
    const ref = doc(db, "healthcheck/testdoc"); // valid path
    await setDoc(ref, { status: "ok", time: new Date().toISOString() });
    const snap = await getDoc(ref);
    console.log("✅ Firestore write/read successful:", snap.data());
    process.exit(0);
  } catch (err) {
    console.error("❌ Firestore test error:", err.message);
    process.exit(1);
  }
}
runTest();
