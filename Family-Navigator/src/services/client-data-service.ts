/**
 * Client Data Service - Browser Safe Firebase Operations
 * Uses only Firebase client SDK - safe for browser use
 */

import { db, auth } from '@/lib/firebase-client';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

export interface FamilyMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

export interface HealthData {
  [key: string]: any;
}

export class ClientDataService {
  // Health Data Operations
  static async getHealthData(memberId: string): Promise<HealthData | null> {
    try {
      const docRef = doc(db, 'healthData', memberId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as HealthData : null;
    } catch (error) {
      console.error('Error getting health data:', error);
      throw error;
    }
  }

  static async saveHealthData(memberId: string, data: HealthData): Promise<void> {
    try {
      const docRef = doc(db, 'healthData', memberId);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error('Error saving health data:', error);
      throw error;
    }
  }

  // Calendar Operations
  static async getCalendarEvents(userId: string) {
    try {
      const q = query(
        collection(db, 'calendarEvents'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }

  static async saveCalendarEvent(eventData: any): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const docRef = doc(collection(db, 'calendarEvents'));
      await setDoc(docRef, { ...eventData, userId: user.uid });
    } catch (error) {
      console.error('Error saving calendar event:', error);
      throw error;
    }
  }

  // Travel Data Operations
  static async getTravelData(userId: string) {
    try {
      const q = query(
        collection(db, 'travelData'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting travel data:', error);
      throw error;
    }
  }

  static async saveTravelData(travelData: any): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const docRef = doc(collection(db, 'travelData'));
      await setDoc(docRef, { ...travelData, userId: user.uid });
    } catch (error) {
      console.error('Error saving travel data:', error);
      throw error;
    }
  }

  // Authentication helpers
  static getCurrentUser() {
    return auth.currentUser;
  }

  static async signOut(): Promise<void> {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
}

export default ClientDataService;
