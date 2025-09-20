
'use server';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import type { HealthData, FamilyMember, AppState } from '@/lib/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const emptyHealthData: HealthData = {
  height: "",
  age: "",
  gender: "",
  weight: "",
  glucose: "",
  notes: "",
};

const defaultState: AppState = {
  Adam: { ...emptyHealthData },
  Holly: { ...emptyHealthData },
  Ethan: { ...emptyHealthData },
  Elle: { ...emptyHealthData },
};

export async function getHealthData(): Promise<AppState> {
  try {
    const healthCol = collection(db, "healthData");
    const healthSnapshot = await getDocs(healthCol);
    
    if (healthSnapshot.empty) {
      console.log("No health data found in Firestore, returning default state.");
      return defaultState;
    }

    const healthData = { ...defaultState };
    healthSnapshot.forEach(doc => {
      healthData[doc.id as FamilyMember] = doc.data() as HealthData;
    });
    return healthData;
  } catch (error) {
    console.error("Error fetching health data from Firestore:", error);
    return defaultState;
  }
}

export async function updateHealthData(member: FamilyMember, data: HealthData): Promise<AppState> {
  const ref = doc(db, "healthData", member);
  await setDoc(ref, data, { merge: true });
  // After updating, fetch all data to return the complete state
  return await getHealthData();
}

// NOTE: Calendar functions are not yet migrated. They will do nothing.
export async function getCalendarEvents(): Promise<any[]> {
  console.warn("getCalendarEvents is not implemented for Firebase backend yet.");
  return [];
}

export async function addCalendarEvent(newEvent: any): Promise<any> {
  console.warn("addCalendarEvent is not implemented for Firebase backend yet.");
  return newEvent;
}

export async function deleteCalendarEvent(eventId: string): Promise<any[]> {
  console.warn("deleteCalendarEvent is not implemented for Firebase backend yet.");
  return [];
}
