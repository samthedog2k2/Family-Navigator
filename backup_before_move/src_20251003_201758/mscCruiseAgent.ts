import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, { Request, Response } from "express";

admin.initializeApp();
const app = express();

app.use(express.json());

app.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    // Example: receive cruise data and store in Firestore
    const cruiseData = req.body;

    if (!cruiseData || Object.keys(cruiseData).length === 0) {
      res.status(400).send({ error: "Missing cruise data" });
      return;
    }

    await admin.firestore().collection("cruiseData").add({
      ...cruiseData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send({ message: "Cruise data saved successfully" });
  } catch (err: any) {
    console.error("Error saving cruise data:", err);
    res.status(500).send({ error: err.message || "Internal server error" });
  }
});

exports.mscCruiseAgent = functions.https.onRequest(app);
