
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function EnhancedLogin() {
  const { user, loading, signInWithGoogle, signInWithEmail, createAccount } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
        router.push('/');
    }
  }, [user, loading, router]);


  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError('');
    
    const result = await signInWithGoogle();
    
    if (!result.success) {
      setError(result.error || 'Google sign-in failed');
    }
    
    // On success, the useEffect will handle the redirect.
    setIsSubmitting(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let result;
    if (mode === 'signup') {
      result = await createAccount(email, password, displayName);
    } else {
      result = await signInWithEmail(email, password);
    }

    if (!result.success) {
      setError(result.error || 'Authentication failed');
      setIsSubmitting(false);
    }
    // On success, the useEffect will handle the redirect to '/'
  };

  if (loading || user) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <Logo className="h-10 w-10" />
            </div>
          <CardTitle className="text-2xl">
            {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'signin' ? 'Sign in to continue to Family Navigator' : 'Enter your details to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            variant="outline"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
            )}
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        
          <form onSubmit={handleEmailSubmit} className="grid gap-4">
             {mode === 'signup' && (
              <div className="grid gap-2">
                <Label htmlFor="displayName">Full Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
             <Button
              variant="link"
              size="sm"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
