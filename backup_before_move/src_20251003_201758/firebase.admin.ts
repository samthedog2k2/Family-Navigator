import * as admin from 'firebase-admin';

const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

if (!serviceAccountString) {
  throw new Error('The GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set. It is required for server-side Firebase operations.');
}

const serviceAccount = JSON.parse(serviceAccountString);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
