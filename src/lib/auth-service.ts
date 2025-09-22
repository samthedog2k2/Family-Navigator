/**
 * SP Comprehensive Authentication Service
 * Handles ALL authentication methods with bulletproof error handling
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
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc
} from 'firebase/firestore';

// Types
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  requiresRedirect?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'readonly' | 'poweruser' | 'admin';
  provider: string;
  createdAt: any;
  lastSignIn: any;
  isActive: boolean;
}

class AuthenticationService {
  private static instance: AuthenticationService;
  
  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  constructor() {
    this.initializeAuthListener();
    this.handleRedirectResult();
  }

  private initializeAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('✅ User state changed - authenticated:', user.email);
        await this.syncUserProfile(user);
      } else {
        console.log('👤 User state changed - not authenticated');
      }
    });
  }

  private async handleRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        console.log('✅ Redirect sign-in successful:', result.user.email);
        await this.createUserProfile(result.user);
      }
    } catch (error: any) {
      console.error('❌ Redirect result error:', error);
    }
  }

  /**
   * GOOGLE SIGN-IN with multiple fallback methods
   */
  async signInWithGoogle(): Promise<AuthResult> {
    console.log('🔐 Starting Google sign-in process...');

    try {
      // Clear any existing issues
      await this.clearAuthState();

      // Method 1: Try popup first
      try {
        console.log('🔄 Attempting popup method...');
        const result = await signInWithPopup(auth, googleProvider);
        
        if (result.user) {
          console.log('✅ Popup sign-in successful:', result.user.email);
          await this.createUserProfile(result.user);
          return { success: true, user: result.user };
        }
      } catch (popupError: any) {
        console.warn('⚠️ Popup failed:', popupError.code);
        
        // If popup fails, try redirect
        if (this.isPopupError(popupError.code)) {
          console.log('🔄 Switching to redirect method...');
          await signInWithRedirect(auth, googleProvider);
          return { success: true, requiresRedirect: true };
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('❌ Google sign-in failed:', error);
      return { 
        success: false, 
        error: this.getReadableError(error.code) 
      };
    }

    return { success: false, error: 'Unknown error occurred' };
  }

  /**
   * EMAIL/PASSWORD SIGN-UP
   */
  async createEmailAccount(email: string, password: string, displayName?: string): Promise<AuthResult> {
    console.log('📧 Creating email account for:', email);

    try {
      // Validate inputs
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (!this.isValidPassword(password)) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      if (result.user) {
        // Update display name if provided
        if (displayName) {
          await updateProfile(result.user, { displayName });
        }

        await this.createUserProfile(result.user, displayName);
        console.log('✅ Email account created successfully');
        return { success: true, user: result.user };
      }
    } catch (error: any) {
      console.error('❌ Email account creation failed:', error);
      return { 
        success: false, 
        error: this.getReadableError(error.code) 
      };
    }

    return { success: false, error: 'Account creation failed' };
  }

  /**
   * EMAIL/PASSWORD SIGN-IN
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    console.log('📧 Signing in with email:', email);

    try {
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (!password) {
        return { success: false, error: 'Please enter your password' };
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (result.user) {
        await this.syncUserProfile(result.user);
        console.log('✅ Email sign-in successful');
        return { success: true, user: result.user };
      }
    } catch (error: any) {
      console.error('❌ Email sign-in failed:', error);
      return { 
        success: false, 
        error: this.getReadableError(error.code) 
      };
    }

    return { success: false, error: 'Sign-in failed' };
  }

  /**
   * SIGN OUT
   */
  async signOut(): Promise<AuthResult> {
    try {
      const user = auth.currentUser;
      if (user) {
        await this.logActivity(user.uid, 'sign_out');
      }

      await firebaseSignOut(auth);
      console.log('✅ User signed out successfully');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Sign out failed:', error);
      return { success: false, error: 'Sign out failed' };
    }
  }

  /**
   * PASSWORD RESET
   */
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      return { 
        success: false, 
        error: this.getReadableError(error.code) 
      };
    }
  }

  /**
   * GET CURRENT USER
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * WAIT FOR AUTH STATE
   */
  async waitForAuthState(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  // Private helper methods
  private async clearAuthState() {
    if (auth.currentUser) {
      try {
        await firebaseSignOut(auth);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn('Failed to clear auth state:', error);
      }
    }
  }

  private isPopupError(code: string): boolean {
    return [
      'auth/popup-blocked',
      'auth/popup-closed-by-user',
      'auth/cancelled-popup-request'
    ].includes(code);
  }

  private async createUserProfile(user: User, displayName?: string) {
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: displayName || user.displayName || '',
      photoURL: user.photoURL || '',
      role: 'readonly', // Default role
      provider: user.providerData[0]?.providerId || 'email',
      createdAt: serverTimestamp(),
      lastSignIn: serverTimestamp(),
      isActive: true
    };

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), profile);
        console.log('✅ User profile created');
      } else {
        await this.syncUserProfile(user);
        console.log('✅ User profile synced');
      }
    } catch (error) {
      console.error('❌ Profile creation failed:', error);
    }
  }

  private async syncUserProfile(user: User) {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        lastSignIn: serverTimestamp(),
        email: user.email,
        displayName: user.displayName || ''
      });
    } catch (error) {
      console.warn('Profile sync failed:', error);
    }
  }

  private async logActivity(userId: string, activity: string) {
    try {
      await addDoc(collection(db, 'user_activity'), {
        userId,
        activity,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.warn('Activity logging failed:', error);
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  private getReadableError(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      // Google OAuth errors
      'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups and try again.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
      'auth/unauthorized-domain': 'This domain is not authorized for sign-in.',
      
      // Email/Password errors
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      
      // General errors
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/internal-error': 'An internal error occurred. Please try again.',
      'auth/invalid-api-key': 'Invalid API key configuration.',
      'auth/app-deleted': 'Firebase app has been deleted.',
      'auth/invalid-user-token': 'Session expired. Please sign in again.'
    };

    return errorMessages[errorCode] || `Authentication error: ${errorCode}`;
  }
}

// Export singleton
export const authService = AuthenticationService.getInstance();
