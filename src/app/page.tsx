
'use client';

import { useAuth } from "@/components/auth/AuthProvider";
import { Dashboard } from "@/components/dashboard";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Loader2 } from "lucide-react";
import EnhancedLogin from "@/components/auth/EnhancedLogin";
import { Suspense } from "react";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
         <LayoutWrapper>
          <EnhancedLogin />
        </LayoutWrapper>
      </div>
    )
  }

  return (
    <LayoutWrapper>
       <Suspense fallback={<div>Loading dashboard...</div>}>
        <Dashboard />
      </Suspense>
    </LayoutWrapper>
  );
}

    