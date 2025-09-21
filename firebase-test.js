const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, getDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testFirestore() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const ref = doc(db, "testCollection", "testDoc");
    await setDoc(ref, { status: "ok", timestamp: new Date().toISOString() });
    const snap = await getDoc(ref);

    console.log("✅ Firestore test doc:", snap.data());
  } catch (err) {
    console.error("❌ Firestore connection failed:", err.message);
  }
}

testFirestore();
