
'use server';

import * as JSONService from "./data-service.json";
import * as FirebaseService from "./data-service.firebase";
import type { HealthData, FamilyMember, AppState } from '@/lib/types';

const backend = process.env.DATA_BACKEND || "json";

// --- Health Data Functions ---
export async function getHealthData(): Promise<AppState & { source: string }> {
  if (backend === "firebase") {
    return await FirebaseService.getHealthData();
  }
  return await JSONService.getHealthData();
}

export async function updateHealthData(member: FamilyMember, data: HealthData): Promise<AppState> {
  if (backend === "firebase") {
    return await FirebaseService.updateHealthData(member, data);
  }
  // This was incorrect. It should call the JSON service's update function.
  return await JSONService.updateHealthData(member, data);
}

// --- Calendar Event Functions ---
// These currently only support the JSON backend.
export async function getCalendarEvents() {
    if (backend === "firebase") {
        return await FirebaseService.getCalendarEvents();
    }
    return await JSONService.getCalendarEvents();
}

export async function addCalendarEvent(newEvent: any) {
    if (backend === "firebase") {
        return await FirebaseService.addCalendarEvent(newEvent);
    }
    return await JSONService.addCalendarEvent(newEvent);
}

export async function deleteCalendarEvent(eventId: string) {
    if (backend === "firebase") {
        return await FirebaseService.deleteCalendarEvent(eventId);
    }
    return await JSONService.deleteCalendarEvent(eventId);
}
