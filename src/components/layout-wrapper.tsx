"use client";

import { Header } from "@/components/header";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 container p-4 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
