'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useFamilyAuth, FamilyNavigatorUser } from '@/lib/firebase-auth';

// Define the shape of the context data
interface AuthContextType {
  user: FamilyNavigatorUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPowerUser: boolean;
  signInWithGoogle: () => Promise<any>;
  createAccount: (email: string, pass: string, name?: string) => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<any>;
  hasRole: (role: 'readonly' | 'poweruser' | 'admin') => Promise<boolean>;
}

// Create the context with an undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useFamilyAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Define the custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
