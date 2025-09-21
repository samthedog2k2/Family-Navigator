const { initializeApp } = require("firebase/app");
const { getFirestore, listCollections } = require("firebase/firestore");
const { firebaseConfig } = require("./src/firebase.js"); // change to .ts if needed

(async () => {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const cols = await listCollections(db);
    console.log("✅ Firestore connected");
    console.log("   Collections:", cols.map(c => c.id));
  } catch (err) {
    console.error("❌ Firestore check failed:", err.message);
  }
})();
