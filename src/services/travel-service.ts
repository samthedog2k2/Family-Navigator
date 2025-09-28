/**
 * SP Travel Service
 * Embodying: Doug Stevenson (Firebase) + Werner Vogels (Scalability)
 */

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

export interface TripPlan {
  id?: string;
  userId: string;
  tripData: any;
  recommendations: any;
  aiAgentResults: any;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'planned' | 'booked' | 'completed';
}

export class TravelService {
  private static collection = 'tripPlans';

  static async saveTripPlan(tripPlan: Omit<TripPlan, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...tripPlan,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving trip plan:', error);
      throw new Error('Failed to save trip plan');
    }
  }

  static async getTripPlans(userId: string): Promise<TripPlan[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collection));
      return querySnapshot.docs
        .filter(doc => doc.data().userId === userId)
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TripPlan));
    } catch (error) {
      console.error('Error getting trip plans:', error);
      throw new Error('Failed to get trip plans');
    }
  }

  static async updateTripPlan(id: string, updates: Partial<TripPlan>): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating trip plan:', error);
      throw new Error('Failed to update trip plan');
    }
  }

  static async deleteTripPlan(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collection, id));
    } catch (error) {
      console.error('Error deleting trip plan:', error);
      throw new Error('Failed to delete trip plan');
    }
  }
}
