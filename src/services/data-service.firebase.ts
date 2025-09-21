
'use server';

import { adminDb } from '@/firebase.admin';
import type { HealthData, FamilyMember, AppState } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const emptyHealthData: HealthData = {
  height: "",
  age: 0,
  gender: "Other",
  weight: "",
  glucose: "",
  notes: "",
};

const defaultState: AppState = {
  Adam: { ...emptyHealthData, gender: "Male" },
  Holly: { ...emptyHealthData, gender: "Female" },
  Ethan: { ...emptyHealthData, gender: "Male" },
  Elle: { ...emptyHealthData, gender: "Female" },
};

async function seedHealthData() {
  console.log("Seeding initial health data to Firestore from app-data.json...");
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'app-data.json');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const appData = JSON.parse(fileContent);
    
    const healthDataToSeed = appData.healthData;
    if (!healthDataToSeed) {
      console.log("No healthData found in app-data.json to seed.");
      return;
    }

    const promises = Object.entries(healthDataToSeed).map(([member, memberData]) => {
      const memberKey = member as FamilyMember;
      return adminDb.collection("healthData").doc(memberKey).set(memberData as HealthData);
    });
    await Promise.all(promises);
    console.log("Seeding complete.");
  } catch (error) {
    console.error("Error seeding data:", error);
    // Don't re-throw, allow the app to continue with an empty/default state.
  }
}

export async function getHealthData(): Promise<AppState & { source: string }> {
  try {
    const healthCol = adminDb.collection("healthData");
    const healthSnapshot = await healthCol.get();
    
    if (healthSnapshot.empty) {
      // The collection is empty, return default state. Seeding should be a separate, deliberate process.
      return { ...defaultState, source: "firebase-empty" };
    }

    const healthData = { ...defaultState };
    healthSnapshot.forEach(doc => {
      healthData[doc.id as FamilyMember] = doc.data() as HealthData;
    });
    return { ...healthData, source: "firebase" };

  } catch (error) {
    console.error("Error fetching health data from Firestore:", error);
    // On error, return a default state so the app doesn't crash.
    return { ...defaultState, source: "firebase-error" };
  }
}

export async function updateHealthData(member: FamilyMember, data: HealthData): Promise<AppState> {
  const ref = adminDb.collection("healthData").doc(member);
  await ref.set(data, { merge: true });
  const updatedData = await getHealthData();
  const { source, ...appState } = updatedData;
  return appState;
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
