
"use client";

import { useState, useEffect } from 'react';
import { 
  User,
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

// Import the unified Firebase configuration
import { auth, db } from './firebase-client';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export type UserRole = 'readonly' | 'poweruser' | 'admin';

export interface FamilyNavigatorUser extends User {
  role?: UserRole;
  familyId?: string;
  createdAt?: any;
  lastSignIn?: any;
}

export class FamilyNavigatorAuth {
  private static instance: FamilyNavigatorAuth;
  
  static getInstance(): FamilyNavigatorAuth {
    if (!FamilyNavigatorAuth.instance) {
      FamilyNavigatorAuth.instance = new FamilyNavigatorAuth();
    }
    return FamilyNavigatorAuth.instance;
  }

  async signInWithGoogle(): Promise<{success: boolean, user?: FamilyNavigatorUser, error?: string, redirect?: boolean}> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        await this.createUserProfile(user, 'readonly');
      } else {
        await this.updateUserProfile(user.uid, {
          lastSignIn: serverTimestamp()
        });
      }

      const enhancedUser = await this.getEnhancedUser(user);
      return { success: true, user: enhancedUser };

    } catch (error: any) {
      // We will no longer use signInWithRedirect as it's unsupported in this environment.
      // We will simply report the popup error.
      console.error("Google Sign-In Error:", error);
      return { success: false, error: this.getReadableError(error.code) };
    }
  }

  async createAccount(
    email: string, 
    password: string, 
    displayName?: string
  ): Promise<{success: boolean, user?: FamilyNavigatorUser, error?: string}> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await this.createUserProfile(user, 'readonly', displayName);
      const enhancedUser = await this.getEnhancedUser(user);
      return { success: true, user: enhancedUser };
    } catch (error: any) {
      return { success: false, error: this.getReadableError(error.code) };
    }
  }

  async signInWithEmail(email: string, password: string): Promise<{success: boolean, user?: FamilyNavigatorUser, error?: string}> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await this.updateUserProfile(user.uid, { lastSignIn: serverTimestamp() });
      const enhancedUser = await this.getEnhancedUser(user);
      return { success: true, user: enhancedUser };
    } catch (error: any) {
      return { success: false, error: this.getReadableError(error.code) };
    }
  }

  async signOut(): Promise<{success: boolean, error?: string}> {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: 'Failed to sign out.' };
    }
  }

  private async createUserProfile(user: User, role: UserRole, displayName?: string) {
    const userProfileRef = doc(db, 'users', user.uid);
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || 'Anonymous',
      photoURL: user.photoURL || '',
      role,
      provider: user.providerData[0]?.providerId || 'email',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastSignIn: serverTimestamp(),
      isActive: true,
    };
    return setDoc(userProfileRef, userProfile, { merge: true });
  }

  private async updateUserProfile(userId: string, updates: any) {
     const userRef = doc(db, 'users', userId);
     const userDoc = await getDoc(userRef);
     if (userDoc.exists()) {
        return updateDoc(userRef, updates);
     }
  }

  private async getUserProfile(userId: string) {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? docSnap.data() : null;
  }

  public async getEnhancedUser(user: User): Promise<FamilyNavigatorUser> {
    const profile = await this.getUserProfile(user.uid);
    return {
      ...user,
      role: profile?.role || 'readonly',
      familyId: profile?.familyId || '',
    } as FamilyNavigatorUser;
  }

  private getReadableError(errorCode: string): string {
    const defaultError = 'An unexpected error occurred. Please try again.';
    const errorMessages: Record<string, string> = {
      'auth/popup-closed-by-user': 'The sign-in window was closed before completion.',
      'auth/popup-blocked': 'The sign-in window was blocked by your browser. Please allow popups for this site.',
      'auth/unauthorized-domain': 'This website is not authorized for authentication. Please contact support.',
      'auth/operation-not-supported-in-this-environment': 'Sign-in is not supported in this environment. Try opening the app in a new browser tab.',
      'auth/email-already-in-use': 'This email address is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
    };
    return errorMessages[errorCode] || defaultError;
  }
}

export const familyAuth = FamilyNavigatorAuth.getInstance();

export function useFamilyAuth() {
  const [user, setUser] = useState<FamilyNavigatorUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const enhancedUser = await familyAuth.getEnhancedUser(firebaseUser);
        setUser(enhancedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signInWithGoogle: familyAuth.signInWithGoogle.bind(familyAuth),
    createAccount: familyAuth.createAccount.bind(familyAuth),
    signInWithEmail: familyAuth.signInWithEmail.bind(familyAuth),
    signOut: familyAuth.signOut.bind(familyAuth),
  };
}
