/**
 * SP Authentication React Hook
 * Simple state management for authentication
 */

import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth-service';
import { User } from '@/lib/firebase-config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const currentUser = await authService.waitForAuthState();
        if (mounted) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth hook error:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signInWithGoogle: () => authService.signInWithGoogle(),
    signInWithEmail: (email: string, password: string) => 
      authService.signInWithEmail(email, password),
    createAccount: (email: string, password: string, displayName?: string) => 
      authService.createEmailAccount(email, password, displayName),
    signOut: () => authService.signOut(),
    resetPassword: (email: string) => authService.resetPassword(email)
  };
}
