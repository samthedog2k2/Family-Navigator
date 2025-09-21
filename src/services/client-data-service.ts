"use client";

import { 
  collection, 
  getDocs, 
  doc, 
  setDoc,
  query,
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import type { HealthData, FamilyMember, AppState } from '@/lib/types';

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

export async function getHealthData(): Promise<AppState & { source: string }> {
  try {
    const healthCol = collection(db, "healthData");
    const healthSnapshot = await getDocs(healthCol);
    
    if (healthSnapshot.empty) {
      return { ...defaultState, source: "firebase-empty" };
    }

    const healthData = { ...defaultState };
    healthSnapshot.forEach(document => {
      healthData[document.id as FamilyMember] = document.data() as HealthData;
    });
    return { ...healthData, source: "firebase" };

  } catch (error) {
    console.error("Error fetching health data from Firestore:", error);
    return { ...defaultState, source: "firebase-error" };
  }
}

export async function updateHealthData(member: FamilyMember, data: HealthData): Promise<AppState> {
  const ref = doc(db, "healthData", member);
  await setDoc(ref, data, { merge: true });
  const updatedData = await getHealthData();
  const { source, ...appState } = updatedData;
  return appState;
}

// Calendar functions (client-side placeholder)
export async function getCalendarEvents(): Promise<any[]> {
  try {
    const eventsCol = collection(db, "calendarEvents");
    const eventsSnapshot = await getDocs(query(eventsCol, orderBy("start", "desc")));
    return eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
}

export async function addCalendarEvent(newEvent: any): Promise<any> {
  try {
    const eventsCol = collection(db, "calendarEvents");
    const eventWithId = { ...newEvent, id: new Date().toISOString() };
    await setDoc(doc(eventsCol, eventWithId.id), eventWithId);
    return eventWithId;
  } catch (error) {
    console.error("Error adding calendar event:", error);
    throw error;
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<any[]> {
  console.warn("deleteCalendarEvent not implemented in client service yet.");
  return [];
}
