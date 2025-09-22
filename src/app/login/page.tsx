"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyAuth } from '@/lib/firebase-auth';
import { Header } from "@/components/header";
import EnhancedLogin from "@/components/auth/EnhancedLogin";

export default function LoginPage() {
  const { user, loading } = useFamilyAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    // Render a loading state or null while checking auth state or redirecting
    return <div>Loading...</div>; 
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <EnhancedLogin />
    </div>
  );
}
