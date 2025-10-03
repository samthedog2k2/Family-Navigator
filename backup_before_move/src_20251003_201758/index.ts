import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// ==== CLOUD FUNCTION: receiveCruiseData ====
export const receiveCruiseData = functions.https.onRequest(async (req, res) => {
  try {
    const data = req.body;

    const docRef = await db.collection("cruiseResults").add({
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: "Cruise data stored",
      documentId: docRef.id,
    });
  } catch (error: any) {
    console.error("Error saving cruise data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
