
import { Dashboard } from "@/components/dashboard";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <LayoutWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </LayoutWrapper>
  );
}
