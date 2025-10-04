// SP Authentication Service - Iframe Environment Compatible
// Expert: Doug Stevenson - Firebase iframe limitations
// Solution: Popup-only auth with environment detection

import { 
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

// Google Auth Provider with proper configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Force account selection (good UX practice)
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Environment detection
function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true; // Assume iframe if we can't check
  }
}

function isFirebaseStudio(): boolean {
  const hostname = window.location.hostname;
  return hostname.includes('cloudworkstations.dev') || 
         hostname.includes('gitpod.io') || 
         hostname.includes('codespaces.dev');
}

// Enhanced logging for debugging
function logAuthEvent(event: string, data?: any, isError = false) {
  const timestamp = new Date().toISOString();
  const prefix = isError ? '❌' : '✅';
  
  if (data) {
    
  } else {
    
  }
}

// Authentication service class
export class AuthService {
  private static instance: AuthService;
  private authStateListeners: ((user: User | null) => void)[] = [];
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initialize() {
    if (this.isInitialized) return;
    
    logAuthEvent('Auth Service Initializing');
    logAuthEvent('Environment Check', {
      isInIframe: isInIframe(),
      isFirebaseStudio: isFirebaseStudio(),
      hostname: window.location.hostname,
      userAgent: navigator.userAgent.substring(0, 100)
    });

    // Set up auth state listener
    onAuthStateChanged(auth, (user) => {
      logAuthEvent('Auth State Changed', {
        userId: user?.uid || 'null',
        email: user?.email || 'null',
        displayName: user?.displayName || 'null'
      });
      
      this.notifyAuthStateListeners(user);
    });

    // Check for existing auth state
    const currentUser = auth.currentUser;
    if (currentUser) {
      logAuthEvent('Existing User Found', {
        email: currentUser.email,
        uid: currentUser.uid
      });
    }

    this.isInitialized = true;
    logAuthEvent('Auth Service Initialized Successfully');
  }

  // Sign in with Google - Popup only for iframe environments
  async signInWithGoogle() {
    try {
      logAuthEvent('Google Sign-In Started');
      
      // Validate environment
      if (isInIframe() && !isFirebaseStudio()) {
        throw new Error('Popup authentication not supported in this iframe environment');
      }

      // Configure popup settings for better compatibility
      const popupOptions = {
        width: 500,
        height: 600,
        scrollbars: 'yes',
        resizable: 'yes'
      };

      logAuthEvent('Starting Google Popup Authentication', popupOptions);

      // Use popup authentication (the only method that works in iframes)
      const result = await signInWithPopup(auth, googleProvider);
      
      logAuthEvent('Google Sign-In Successful', {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        providerId: result.providerId
      });

      return result.user;

    } catch (error: any) {
      logAuthEvent('Google Sign-In Failed', {
        code: error.code,
        message: error.message,
        stack: error.stack?.substring(0, 200)
      }, true);

      // Provide user-friendly error messages
      let userMessage = 'Sign-in failed. Please try again.';
      
      switch (error.code) {
        case 'auth/popup-blocked':
          userMessage = 'Popup was blocked. Please allow popups and try again.';
          break;
        case 'auth/popup-closed-by-user':
          userMessage = 'Sign-in was cancelled.';
          break;
        case 'auth/network-request-failed':
          userMessage = 'Network error. Please check your connection.';
          break;
        case 'auth/too-many-requests':
          userMessage = 'Too many attempts. Please wait a few minutes.';
          break;
        case 'auth/operation-not-supported-in-this-environment':
          userMessage = 'Sign-in not supported in this environment. Try opening in a new tab.';
          break;
      }

      throw new Error(userMessage);
    }
  }

  // Sign out
  async signOut() {
    try {
      logAuthEvent('Sign Out Started');
      await signOut(auth);
      logAuthEvent('Sign Out Successful');
    } catch (error: any) {
      logAuthEvent('Sign Out Failed', {
        code: error.code,
        message: error.message
      }, true);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Add auth state listener
  onAuthStateChange(callback: (user: User | null) => void) {
    this.authStateListeners.push(callback);
    // Call immediately with current state
    callback(auth.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.authStateListeners = this.authStateListeners.filter(
        listener => listener !== callback
      );
    };
  }

  // Notify all listeners of auth state changes
  private notifyAuthStateListeners(user: User | null) {
    this.authStateListeners.forEach(listener => {
      try {
        listener(user);
      } catch (error) {
        logAuthEvent('Auth State Listener Error', error, true);
      }
    });
  }

  // Get detailed auth state for debugging
  getAuthDebugInfo() {
    const user = auth.currentUser;
    return {
      user: user ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      } : null,
      environment: {
        isInIframe: isInIframe(),
        isFirebaseStudio: isFirebaseStudio(),
        hostname: window.location.hostname,
        protocol: window.location.protocol
      },
      authInstance: {
        app: auth.app.name,
        currentUser: !!auth.currentUser,
        config: auth.config
      }
    };
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Convenience functions
export const signInWithGoogle = () => authService.signInWithGoogle();
export const signOutUser = () => authService.signOut();
export const getCurrentUser = () => authService.getCurrentUser();
export const onAuthStateChange = (callback: (user: User | null) => void) => 
  authService.onAuthStateChange(callback);
export const getAuthDebugInfo = () => authService.getAuthDebugInfo();
