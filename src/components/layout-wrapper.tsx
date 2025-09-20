
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
        "flex-1 p-4 sm:px-6 sm:py-8",
        "md:peer-data-[state=expanded]:[--sidebar-offset:var(--sidebar-width)]",
        "md:peer-data-[state=collapsed]:[--sidebar-offset:var(--sidebar-width-icon)]",
        "md:pl-[var(--sidebar-offset,0rem)]",
        "transition-[padding-left] duration-200 ease-linear"
      )}>
        {children}
      </main>
    </div>
  );
}
