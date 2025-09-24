// SP Login Form - Enhanced for Iframe Environment
// Expert: Steve Jobs - User experience in constrained environments
// Debug: Enhanced logging and error handling

'use client';

import { useState, useEffect } from 'react';
import { signInWithGoogle, onAuthStateChange, getAuthDebugInfo } from '@/services/auth-service';
import { User } from 'firebase/auth';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    console.log('🎨 LoginForm component mounted');
    
    // Get debug info
    const debug = getAuthDebugInfo();
    setDebugInfo(debug);
    console.log('🔍 Auth Debug Info:', debug);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      console.log('🔄 Auth state change in LoginForm:', user?.email || 'No user');
      setUser(user);
      
      if (user) {
        console.log('✅ User authenticated, preparing redirect...');
        // Small delay to ensure state is properly set
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    });

    return () => {
      console.log('🧹 LoginForm component unmounting');
      unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    console.log('🚀 Google sign-in button clicked');
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await signInWithGoogle();
      console.log('✅ Sign-in completed successfully:', user.email);
      // Success handled by auth state listener
    } catch (error: any) {
      console.error('❌ Sign-in error in component:', error);
      setError(error.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const toggleDebugInfo = () => {
    const newDebugInfo = debugInfo ? null : getAuthDebugInfo();
    setDebugInfo(newDebugInfo);
    if (newDebugInfo) {
      console.log('🔍 Current Auth Debug Info:', newDebugInfo);
    }
  };

  // Don't render login form if user is already authenticated
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Welcome back, {user.displayName || user.email}!</p>
          <p className="text-sm text-gray-500">Redirecting to app...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">FN</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Family Navigator</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Sign-in Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                {error.includes('environment') && (
                  <p className="mt-2 text-xs text-red-600">
                    Try opening this page in a new browser tab or window.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-3"></div>
              Signing in...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        {/* Debug Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleDebugInfo}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {debugInfo ? 'Hide' : 'Show'} Debug Info
          </button>
        </div>

        {/* Debug Info Display */}
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
            <h4 className="font-semibold mb-2">Debug Information:</h4>
            <pre className="text-gray-600 whitespace-pre-wrap overflow-hidden">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Secure authentication powered by Google
          </p>
        </div>
      </div>
    </div>
  );
}
