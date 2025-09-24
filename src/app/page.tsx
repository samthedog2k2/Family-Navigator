'use client';

import { useAuth } from "@/components/auth/AuthProvider";
import EnhancedLogin from "@/components/auth/EnhancedLogin";
import { Dashboard } from "@/components/dashboard";
import { Loader2 } from "lucide-react";

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

  return user ? <Dashboard /> : <EnhancedLogin />;
}
