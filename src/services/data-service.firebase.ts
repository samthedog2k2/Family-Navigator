
'use server';

import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import type { HealthData, FamilyMember, AppState } from '@/lib/types';
import { app } from '@/firebase';
import * as JSONService from "./data-service.json";

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

async function seedHealthData() {
    console.log("Seeding initial health data to Firestore from JSON file...");
    const { source, ...healthDataToSeed } = await JSONService.getHealthData();
    
    const promises = Object.keys(healthDataToSeed).map(member => {
        const memberKey = member as FamilyMember;
        const memberData = healthDataToSeed[memberKey];
        if (memberData) {
            const docRef = doc(db, "healthData", memberKey);
            return setDoc(docRef, memberData);
        }
    });
    await Promise.all(promises);
    console.log("Seeding complete.");
}


export async function getHealthData(): Promise<AppState & { source: string }> {
  try {
    const healthCol = collection(db, "healthData");
    const healthSnapshot = await getDocs(healthCol);
    
    if (healthSnapshot.empty) {
      await seedHealthData();
      const seededSnapshot = await getDocs(healthCol);
       const healthData = { ...defaultState };
        seededSnapshot.forEach(document => {
            healthData[document.id as FamilyMember] = document.data() as HealthData;
        });
        return { ...healthData, source: "firebase" };
    }

    const healthData = { ...defaultState };
    healthSnapshot.forEach(document => {
      healthData[document.id as FamilyMember] = document.data() as HealthData;
    });
    return { ...healthData, source: "firebase" };
  } catch (error) {
    console.error("Error fetching health data from Firestore:", error);
    const { source, ...jsonState} = await JSONService.getHealthData();
    return { ...jsonState, source: "firebase-error" };
  }
}

export async function updateHealthData(member: FamilyMember, data: HealthData): Promise<AppState> {
  const ref = doc(db, "healthData", member);
  await setDoc(ref, data, { merge: true });
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
