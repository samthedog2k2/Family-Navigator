
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { HealthData, FamilyMember, AppState } from '@/lib/types';

// Define the structure of a calendar event
type CalendarEvent = {
  id: string;
  title: string;
  start: string; 
  end: string;
  calendar: FamilyMember | 'Family';
  color: 'blue' | 'green' | 'purple' | 'orange';
};

// Define the structure of our entire application's data
type FullAppData = {
  healthData: AppState;
  calendarEvents: CalendarEvent[];
};

// The path to our JSON file database
const dataPath = path.join(process.cwd(), 'src', 'data', 'app-data.json');

/**
 * Reads the entire application data from the JSON file.
 * @returns A promise that resolves to the parsed application data.
 */
async function readData(): Promise<FullAppData> {
  try {
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading data file:', error);
    // If the file doesn't exist or is corrupt, return a default structure
    return { 
      healthData: {
        Adam: { height: "", age: 0, gender: "Male", weight: "", glucose: "", notes: "" },
        Holly: { height: "", age: 0, gender: "Female", weight: "", glucose: "", notes: "" },
        Ethan: { height: "", age: 0, gender: "Male", weight: "", glucose: "", notes: "" },
        Elle: { height: "", age: 0, gender: "Female", weight: "", glucose: "", notes: "" },
      }, 
      calendarEvents: [] 
    };
  }
}

/**
 * Writes the entire application data to the JSON file.
 * @param data - The application data to write to the file.
 * @returns A promise that resolves when the file has been written.
 */
async function writeData(data: FullAppData): Promise<void> {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
  }
}

// --- Health Data Functions ---

/**
 * Retrieves all health data for every family member.
 * @returns A promise that resolves to the health data records.
 */
export async function getHealthData(): Promise<AppState & { source: string }> {
  const data = await readData();
  return { ...data.healthData, source: "json" };
}

/**
 * Updates the health data for a specific family member.
 * @param member - The family member to update.
 * @param memberData - The new health data for the family member.
 * @returns A promise that resolves to the updated health data records.
 */
export async function updateHealthData(member: FamilyMember, memberData: HealthData): Promise<AppState> {
  const data = await readData();
  data.healthData[member] = memberData;
  await writeData(data);
  return data.healthData;
}


// --- Calendar Event Functions ---

/**
 * Retrieves all calendar events.
 * @returns A promise that resolves to an array of all calendar events.
 */
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const data = await readData();
  return data.calendarEvents;
}

/**
 * Adds a new calendar event.
 * @param newEvent - The new event to add to the calendar.
 * @returns A promise that resolves to the newly created event.
 */
export async function addCalendarEvent(newEvent: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
  const data = await readData();
  const eventWithId: CalendarEvent = { ...newEvent, id: new Date().toISOString() };
  data.calendarEvents.push(eventWithId);
  await writeData(data);
  return eventWithId;
}

/**
 * Deletes a calendar event by its ID.
 * @param eventId - The ID of the event to delete.
 * @returns A promise that resolves to the updated array of calendar events.
 */
export async function deleteCalendarEvent(eventId: string): Promise<CalendarEvent[]> {
    const data = await readData();
    data.calendarEvents = data.calendarEvents.filter(event => event.id !== eventId);
    await writeData(data);
    return data.calendarEvents;
}
