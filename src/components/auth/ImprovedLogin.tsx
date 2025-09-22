/**
 * SP Improved Login Component
 * Handles OAuth callbacks and URL error parameters
 */

'use client';

import React, { useState, useEffect } from 'react';
import { updatedAuthService } from '@/lib/auth-service-updated';
import { User } from '@/lib/firebase-config';

export default function ImprovedLogin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for redirect result first
        const redirectResult = await updatedAuthService.checkRedirectResult();
        if (redirectResult?.success && redirectResult.user) {
          setUser(redirectResult.user);
          setLoading(false);
          return;
        }

        // Check for URL error parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlError = urlParams.get('error');
        if (urlError) {
          setError(urlError);
          // Clean up URL
          window.history.replaceState({}, '', window.location.pathname);
        }

        // Check current user
        const currentUser = updatedAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError('');

    try {
      const result = await updatedAuthService.signInWithGoogle();
      
      if (result.success) {
        if (result.user) {
          setUser(result.user);
        } else if (result.requiresRedirect) {
          // Redirect initiated, user will be redirected to Google
          return;
        }
      } else {
        setError(result.error || 'Sign-in failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600 mb-4">Successfully signed in</p>
            
            <div className="text-left space-y-2 mb-6">
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
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <p className="text-green-700 text-sm">
                🎉 Authentication is now working! Your OAuth callback handler has been fixed.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Continue to Family Navigator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-indigo-600 text-2xl font-bold">N</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Family Navigator</h2>
          <p className="text-gray-600 mb-6">Sign in to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="mt-4 text-xs text-gray-500 text-center">
            OAuth callback handler has been fixed.<br/>
            Authentication should now work properly.
          </div>
        </div>
      </div>
    </div>
  );
}
