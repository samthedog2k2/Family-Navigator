/**
 * SP Firebase Auth Callback Handler
 * Handles OAuth redirects from Google/other providers
 * This page processes the authentication result and redirects
 */

'use client';

import { useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';

export default function AuthHandler() {
  useEffect(() => {
    const handleAuthResult = async () => {
      try {
        console.log('🔄 Processing OAuth callback...');
        
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          console.log('✅ OAuth success:', result.user.email);
          
          // Create user profile in Firestore
          const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase-config');
          
          const userProfile = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName || '',
            photoURL: result.user.photoURL || '',
            role: 'readonly',
            provider: result.user.providerData[0]?.providerId || 'google',
            createdAt: serverTimestamp(),
            lastSignIn: serverTimestamp(),
            isActive: true
          };

          await setDoc(doc(db, 'users', result.user.uid), userProfile, { merge: true });
          
          // Redirect to main app
          window.location.href = '/';
        } else {
          console.log('❌ No auth result, redirecting to login');
          window.location.href = '/login';
        }
      } catch (error: any) {
        console.error('❌ Auth callback error:', error);
        
        // Show user-friendly error and redirect
        const errorMessage = error.code === 'auth/popup-closed-by-user' 
          ? 'Sign-in was cancelled'
          : 'Authentication failed';
          
        // Redirect with error parameter
        const url = new URL('/login', window.location.origin);
        url.searchParams.set('error', errorMessage);
        window.location.href = url.toString();
      }
    };

    handleAuthResult();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign-in...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we process your authentication.</p>
      </div>
    </div>
  );
}
