/**
 * SP Updated Authentication Service
 * Improved error handling for OAuth callbacks
 */

import { 
  auth, 
  db, 
  googleProvider,
  User, 
  UserCredential, 
  AuthError 
} from './firebase-config';

import {
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  requiresRedirect?: boolean;
}

class UpdatedAuthService {
  private static instance: UpdatedAuthService;
  
  static getInstance(): UpdatedAuthService {
    if (!UpdatedAuthService.instance) {
      UpdatedAuthService.instance = new UpdatedAuthService();
    }
    return UpdatedAuthService.instance;
  }

  constructor() {
    this.initializeAuthListener();
  }

  private initializeAuthListener() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ User authenticated:', user.email);
      } else {
        console.log('👤 No user authenticated');
      }
    });
  }

  /**
   * IMPROVED GOOGLE SIGN-IN with redirect-only flow
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      console.log('🔐 Starting Google sign-in with redirect...');

      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }

      await signInWithRedirect(auth, googleProvider);
      
      return { success: true, requiresRedirect: true };

    } catch (error: any) {
      console.error('❌ Google sign-in failed:', error);
      return { 
        success: false, 
        error: this.getReadableError(error.code) 
      };
    }
  }

  /**
   * CHECK FOR REDIRECT RESULT on page load
   */
  async checkRedirectResult(): Promise<AuthResult | null> {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        console.log('✅ Redirect sign-in successful');
        await this.createUserProfile(result.user);
        return { success: true, user: result.user };
      }
    } catch (error: any) {
      console.error('❌ Redirect result error:', error);
      return { 
        success: false, 
        error: this.getReadableError(error.code) 
      };
    }
    return null;
  }

  private async createUserProfile(user: User) {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    
    const userProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role: 'readonly',
      provider: user.providerData[0]?.providerId || 'google',
      createdAt: serverTimestamp(),
      lastSignIn: serverTimestamp(),
      isActive: true
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
      console.log('✅ User profile created/updated');
    } catch (error) {
      console.error('❌ Profile creation failed:', error);
    }
  }

  private getReadableError(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups and try again.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/unauthorized-domain': 'This domain is not authorized for sign-in.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/internal-error': 'An internal error occurred. Please try again.'
    };

    return errorMessages[errorCode] || `Authentication error: ${errorCode}`;
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export const updatedAuthService = UpdatedAuthService.getInstance();
