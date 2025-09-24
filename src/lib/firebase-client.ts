// SP Firebase Client Configuration - Iframe Compatible
// Expert: Alex Mamo - Client environment handling
// Environment: Firebase Studio/Cloud Workstations

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA0EoNnXE6uYFGn16gp0bmAEWQA77xiDiQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-5461927014-a4c9a.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-5461927014-a4c9a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-5461927014-a4c9a.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "834273609286",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:834273609286:web:5d4c4cd889c545061aac47"
};

// Initialize Firebase (avoid duplicate initialization)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');
} else {
  app = getApps()[0];
  console.log('✅ Firebase app already initialized');
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Log environment info for debugging
if (typeof window !== 'undefined') {
  console.log('🌐 Firebase Environment Info:', {
    hostname: window.location.hostname,
    isIframe: window.self !== window.top,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
  });
}

export default app;
