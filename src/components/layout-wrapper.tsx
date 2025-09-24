
"use client";

import { Header } from "@/components/header";
import { cn } from "@/lib/utils";

export function LayoutWrapper({ 
  children,
  className,
  hideHeader = false,
}: { 
  children: React.ReactNode,
  className?: string;
  hideHeader?: boolean;
 }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {!hideHeader && <Header />}
      <main className={cn("flex-1 p-4 sm:p-6", className)}>
        {children}
      </main>
    </div>
  );
}
