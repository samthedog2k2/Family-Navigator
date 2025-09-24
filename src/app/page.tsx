
'use client';

import { useAuth } from "@/components/auth/AuthProvider";
import { Dashboard } from "@/components/dashboard";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading account...</p>
      </div>
    );
  }

  return (
    <LayoutWrapper hideHeader={true}>
       <Suspense fallback={<div>Loading dashboard...</div>}>
        <Dashboard />
      </Suspense>
    </LayoutWrapper>
  );
}
