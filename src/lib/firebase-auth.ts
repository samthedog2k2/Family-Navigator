
"use client";

/**
 * SP Enhanced Firebase Authentication Integration
 * For Family Navigator - Builds on existing Firebase setup
 * Embodying collective wisdom of Firebase experts
 */
import { useState, useEffect } from 'react';
import { 
  User,
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
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
  serverTimestamp,
  collection,
  addDoc
} from 'firebase/firestore';

// Import your existing Firebase configuration
import { auth, db } from './firebase-client'; // Using the new unified client config

// Enhanced Google Auth Provider with better security
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// User role types for your Family Navigator
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

  constructor() {
    this.initializeAuthListener();
    this.processRedirectResult();
  }

  private async processRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        const user = result.user;
        console.log('✅ Successfully handled redirect result.');
        const userProfile = await this.getUserProfile(user.uid);
        if (!userProfile) {
          await this.createUserProfile(user, 'readonly');
          console.log('✅ New user profile created from redirect.');
        }
      }
    } catch (error: any) {
      console.error('❌ Error handling redirect result:', error);
    }
  }

  private initializeAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.updateUserProfile(user.uid, {
            lastSignIn: serverTimestamp()
        });
        await this.logUserActivity(user.uid, 'sign_in');
      }
    });
  }

  /**
   * GOOGLE OAUTH SIGN-IN
   * Enhanced for Family Navigator with role assignment and redirect fallback
   */
  async signInWithGoogle(): Promise<{success: boolean, user?: FamilyNavigatorUser, error?: string, redirect?: boolean}> {
    try {
      console.log('🔐 Starting Google OAuth flow with popup...');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        await this.createUserProfile(user, 'readonly');
        console.log('✅ New user profile created');
      } else {
        await this.updateUserProfile(user.uid, {
          lastSignIn: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('✅ Existing user sign-in updated');
      }

      const enhancedUser = await this.getEnhancedUser(user);
      return { success: true, user: enhancedUser };

    } catch (error: any) {
      const popupErrors = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/popup-blocked'];
      if (popupErrors.includes(error.code)) {
        console.log('🔐 Popup failed, falling back to redirect flow...');
        try {
          await signInWithRedirect(auth, googleProvider);
          // This promise does not resolve as the page redirects.
          // We return a flag to let the caller know a redirect has been initiated.
          return { success: true, redirect: true };
        } catch (redirectError: any) {
           console.error('❌ Google redirect sign-in error:', redirectError);
           return { success: false, error: this.getReadableError(redirectError.code) };
        }
      }

      console.error('❌ Google sign-in error:', error);
      return { 
        success: false, 
        error: this.getReadableError(error.code) 
      };
    }
  }

  /**
   * LOCAL ACCOUNT CREATION
   */
  async createLocalAccount(
    email: string, 
    password: string, 
    displayName?: string,
    initialRole: UserRole = 'readonly'
  ): Promise<{success: boolean, user?: FamilyNavigatorUser, error?: string}> {
    try {
      console.log('📧 Creating local account...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await this.createUserProfile(user, initialRole, displayName);
      const enhancedUser = await this.getEnhancedUser(user);
      return { success: true, user: enhancedUser };
    } catch (error: any) {
      console.error('❌ Account creation error:', error);
      return { success: false, error: this.getReadableError(error.code) };
    }
  }

  /**
   * LOCAL ACCOUNT SIGN-IN
   */
  async signInWithEmail(email: string, password: string): Promise<{success: boolean, user?: FamilyNavigatorUser, error?: string}> {
    try {
      console.log('📧 Signing in with email...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const enhancedUser = await this.getEnhancedUser(user);
      return { success: true, user: enhancedUser };
    } catch (error: any) {
      console.error('❌ Email sign-in error:', error);
      return { success: false, error: this.getReadableError(error.code) };
    }
  }

  /**
   * SIGN OUT
   */
  async signOut(): Promise<{success: boolean, error?: string}> {
    try {
      const user = auth.currentUser;
      if (user) {
        await this.logUserActivity(user.uid, 'sign_out');
      }
      await firebaseSignOut(auth);
      console.log('✅ User signed out successfully');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      return { success: false, error: 'Failed to sign out. Please try again.' };
    }
  }

  /**
   * GET CURRENT USER WITH ROLE
   */
  async getCurrentUser(): Promise<FamilyNavigatorUser | null> {
    const user = auth.currentUser;
    if (!user) return null;
    return await this.getEnhancedUser(user);
  }

  /**
   * CHECK USER ROLE
   */
  async hasRole(requiredRole: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user?.role) return false;
    const roleHierarchy: Record<UserRole, number> = {
      'readonly': 1,
      'poweruser': 2,
      'admin': 3
    };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  /**
   * UPDATE USER ROLE (Admin only)
   */
  async updateUserRole(userId: string, newRole: UserRole, adminUserId: string): Promise<{success: boolean, error?: string}> {
    try {
      const isAdmin = await this.hasRole('admin');
      if (!isAdmin) {
        return { success: false, error: 'Insufficient permissions' };
      }
      await this.updateUserProfile(userId, {
        role: newRole,
        updatedAt: serverTimestamp(),
        updatedBy: adminUserId
      });
      await this.logAdminAction(adminUserId, 'role_update', {
        targetUserId: userId,
        newRole: newRole
      });
      return { success: true };
    } catch (error: any) {
      console.error('❌ Role update error:', error);
      return { success: false, error: 'Failed to update user role' };
    }
  }

  /**
   * PRIVATE HELPER METHODS
   */
  private async createUserProfile(user: User, role: UserRole, displayName?: string) {
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || '',
      photoURL: user.photoURL || '',
      role: role,
      provider: user.providerData[0]?.providerId || 'email',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastSignIn: serverTimestamp(),
      isActive: true,
      familyId: '',
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en'
      }
    };
    await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
  }

  private async updateUserProfile(userId: string, updates: any) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      await updateDoc(userRef, updates);
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
      createdAt: profile?.createdAt,
      lastSignIn: profile?.lastSignIn
    } as FamilyNavigatorUser;
  }

  private async logUserActivity(userId: string, activity: string) {
    try {
      await addDoc(collection(db, 'user_activity'), {
        userId: userId,
        activity: activity,
        timestamp: serverTimestamp(),
        ipAddress: 'client-side',
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.warn('Failed to log user activity:', error);
    }
  }

  private async logAdminAction(adminId: string, action: string, details: any) {
    try {
      await addDoc(collection(db, 'admin_actions'), {
        adminId: adminId,
        action: action,
        details: details,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.warn('Failed to log admin action:', error);
    }
  }

  private getReadableError(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'This email address is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/popup-blocked': 'Pop-up was blocked by the browser.',
      'auth/unauthorized-domain': 'This website is not authorized to use Firebase Authentication. Please contact support.'
    };
    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }
}

// Export singleton instance
export const familyAuth = FamilyNavigatorAuth.getInstance();

// Export hook for React components
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
    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPowerUser: ['poweruser', 'admin'].includes(user?.role || ''),
    signInWithGoogle: familyAuth.signInWithGoogle.bind(familyAuth),
    createAccount: familyAuth.createLocalAccount.bind(familyAuth),
    signInWithEmail: familyAuth.signInWithEmail.bind(familyAuth),
    signOut: familyAuth.signOut.bind(familyAuth),
    hasRole: familyAuth.hasRole.bind(familyAuth)
  };
}
