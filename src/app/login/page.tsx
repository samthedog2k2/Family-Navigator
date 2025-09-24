
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import EnhancedLogin from "@/components/auth/EnhancedLogin";
import { Loader2 } from 'lucide-react';
import { LayoutWrapper } from '@/components/layout-wrapper';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
    );
  }

  return (
    <LayoutWrapper>
      <EnhancedLogin />
    </LayoutWrapper>
  );
}
