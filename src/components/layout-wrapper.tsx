
"use client";

import { Header } from "@/components/header";
import { cn } from "@/lib/utils";

export function LayoutWrapper({ 
  children,
}: { 
  children: React.ReactNode,
 }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className={cn(
        "flex-1 p-4 sm:px-6 sm:py-8 transition-all md:pl-[var(--sidebar-width)]"
      )}>
        {children}
      </main>
    </div>
  );
}
