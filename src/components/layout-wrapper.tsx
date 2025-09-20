
"use client";

import { Header } from "@/components/header";
import { useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";

export function LayoutWrapper({ 
  children,
  isSidebar,
}: { 
  children: React.ReactNode,
  isSidebar?: boolean,
 }) {
  const { state } = useSidebar();
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className={cn("flex-1 container p-4 sm:px-6 sm:py-8")}>
        {children}
      </main>
    </div>
  );
}
