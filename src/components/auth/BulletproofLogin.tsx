/**
 * SP Bulletproof Login Component
 * Handles ALL authentication scenarios with comprehensive error handling
 */

'use client';

import React, { useState, useEffect } from 'react';
import { authService, AuthResult } from '@/lib/auth-service';
import { User } from '@/lib/firebase-config';

type AuthMode = 'signin' | 'signup' | 'reset';

export default function BulletproofLogin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await authService.waitForAuthState();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth state check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const result: AuthResult = await authService.signInWithGoogle();
    
    if (result.success) {
      if (result.requiresRedirect) {
        setSuccess('Redirecting to Google for sign-in...');
      } else if (result.user) {
        setUser(result.user);
        setSuccess('Successfully signed in with Google!');
      }
    } else {
      setError(result.error || 'Google sign-in failed');
    }

    setIsSubmitting(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    let result: AuthResult;

    switch (mode) {
      case 'signup':
        result = await authService.createEmailAccount(email, password, displayName);
        if (result.success) {
          setSuccess('Account created successfully!');
          setUser(result.user || null);
        } else {
          setError(result.error || 'Account creation failed');
        }
        break;

      case 'signin':
        result = await authService.signInWithEmail(email, password);
        if (result.success) {
          setSuccess('Successfully signed in!');
          setUser(result.user || null);
        } else {
          setError(result.error || 'Sign-in failed');
        }
        break;

      case 'reset':
        result = await authService.resetPassword(email);
        if (result.success) {
          setSuccess('Password reset email sent! Check your inbox.');
          setMode('signin');
        } else {
          setError(result.error || 'Password reset failed');
        }
        break;
    }

    setIsSubmitting(false);
  };

  const handleSignOut = async () => {
    const result = await authService.signOut();
    if (result.success) {
      setUser(null);
      setSuccess('Signed out successfully');
    } else {
      setError('Sign out failed');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
    setSuccess('');
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Authenticated state
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full" />
                  ) : (
                    <span className="text-green-600 text-xl">✅</span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
                  <p className="text-gray-600">Authentication successful</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">User Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-gray-900">{user.displayName || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Provider:</span>
                    <p className="text-gray-900">{user.providerData[0]?.providerId || 'email'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">User ID:</span>
                    <p className="text-gray-900 font-mono text-xs">{user.uid}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Next Steps</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700">Authentication successful</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700">User profile created</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">🔄</span>
                    <span className="text-gray-700">Ready for Family Navigator features</span>
                  </div>
                </div>
              </div>
            </div>

            {success && (
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <p className="text-green-700">{success}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'signin' && 'Sign in to continue to Family Navigator'}
            {mode === 'signup' && 'Create your Family Navigator account'}
            {mode === 'reset' && 'Enter your email to reset password'}
          </p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}

        {/* Google Sign-In Button */}
        {mode !== 'reset' && (
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isSubmitting ? 'Processing...' : 'Continue with Google'}
          </button>
        )}

        {mode !== 'reset' && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with email</span>
            </div>
          </div>
        )}

        {/* Email Form */}
        <form className="mt-8 space-y-6" onSubmit={handleEmailAuth}>
          <div className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="displayName" className="sr-only">Full name</label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Full name (optional)"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"#!/bin/bash

# SP COMPLETE AUTHENTICATION HOTFIX
# Fixes both Google OAuth and Email/Password authentication
# Copy/paste this entire script to terminal
# Embodying collective wisdom: Doug Stevenson + Alex Mamo + Bruce Schneier

echo "🚨 SP COMPLETE AUTHENTICATION HOTFIX"
echo "Fixing Google OAuth AND Email authentication failures..."
echo "======================================================="

# Create backup of existing files
echo "📦 Creating backups..."
mkdir -p backup/$(date +%Y%m%d_%H%M%S)
cp -r src/lib backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || echo "No existing lib to backup"
cp -r src/components backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || echo "No existing components to backup"

# Ensure required directories exist
mkdir -p src/lib
mkdir -p src/components/auth
mkdir -p scripts

# Step 1: Create bulletproof Firebase configuration
echo "🔧 Step 1: Creating bulletproof Firebase configuration..."
cat > src/lib/firebase-config.ts << 'EOF'
/**
 * SP Bulletproof Firebase Configuration
 * Handles all authentication methods with fallbacks
 * Doug Stevenson + Alex Mamo patterns
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  AuthError
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore,
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Firebase configuration with fallbacks
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA0EoNnXE6uYFGn16gp0bmAEWQA77xiDiQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-5461927014-a4c9a.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-5461927014-a4c9a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-5461927014-a4c9a.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "834273609286",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:834273609286:web:5d4c4cd889c545061aac47"
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  // Check if Firebase is already initialized
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw new Error('Firebase initialization failed');
}

// Configure Google Auth Provider with all required settings
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline'
});

// Add scopes explicitly
googleProvider.addScope('email');
googleProvider.addScope('profile');

export { app, auth, db, googleProvider };

// Export types
export type { User, UserCredential, AuthError };
                  name="password"
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 
               mode === 'signin' ? 'Sign in' :
               mode === 'signup' ? 'Create account' :
               'Send reset email'}
            </button>
          </div>

          {/* Mode switching */}
          <div className="text-center space-y-2">
            {mode === 'signin' && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Don't have an account? Sign up
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-gray-600 hover:text-gray-500 text-sm"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Already have an account? Sign in
              </button>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Back to sign in
              </button>
            )}
          </div>
        </form>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md text-xs">
            <p className="font-medium text-gray-700 mb-2">Debug Info:</p>
            <p className="text-gray-600">Mode: {mode}</p>
            <p className="text-gray-600">Loading: {loading ? 'true' : 'false'}</p>
            <p className="text-gray-600">Submitting: {isSubmitting ? 'true' : 'false'}</p>
            <p className="text-gray-600">User: {user ? 'authenticated' : 'not authenticated'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
