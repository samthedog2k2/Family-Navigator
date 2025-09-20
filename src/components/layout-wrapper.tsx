
"use client";

import { Header } from "@/components/header";
import { SidebarContext, useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { useContext }
 from "react";
export function LayoutWrapper({ 
  children,
}: { 
  children: React.ReactNode,
 }) {
  const sidebarContext = useContext(SidebarContext);
  const state = sidebarContext ? useSidebar().state : null;
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className={cn("flex-1 container p-4 sm:px-6 sm:py-8", 
        state === 'collapsed' && "md:pl-[calc(var(--sidebar-width-icon)+2rem)]",
        state === 'expanded' && "md:pl-[calc(var(--sidebar-width)+2rem)]"
      )}>
        {children}
      </main>
    </div>
  );
}
