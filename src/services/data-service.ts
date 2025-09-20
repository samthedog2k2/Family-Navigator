
'use server';

import * as JSONService from "./data-service.json";
import * as FirebaseService from "./data-service.firebase";
import type { HealthData, FamilyMember, AppState } from '@/lib/types';

const backend = process.env.DATA_BACKEND || "json";

// --- Health Data Functions ---
export function getHealthData(): Promise<AppState> {
  if (backend === "firebase") {
    // @ts-ignore
    return FirebaseService.getHealthData();
  }
  return JSONService.getHealthData();
}

export function updateHealthData(member: FamilyMember, data: HealthData): Promise<AppState> {
  if (backend === "firebase") {
    return FirebaseService.updateHealthData(member, data);
  }
  return JSONService.updateHealthData(member, data);
}

// --- Calendar Event Functions ---
// These currently only support the JSON backend.
export function getCalendarEvents() {
    if (backend === "firebase") {
        return FirebaseService.getCalendarEvents();
    }
    return JSONService.getCalendarEvents();
}

export function addCalendarEvent(newEvent: any) {
    if (backend === "firebase") {
        return FirebaseService.addCalendarEvent(newEvent);
    }
    return JSONService.addCalendarEvent(newEvent);
}

export function deleteCalendarEvent(eventId: string) {
    if (backend === "firebase") {
        return FirebaseService.deleteCalendarEvent(eventId);
    }
    return JSONService.deleteCalendarEvent(eventId);
}
