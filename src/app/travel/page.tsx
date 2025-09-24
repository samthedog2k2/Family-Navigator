import { CruiseSearch } from "@/components/cruise-search";
import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";

export default function TravelPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <PageHeader
        title="AI-Powered Cruise Search"
        description="Find your next cruise adventure. Describe your ideal trip and let our AI find the best options for you."
      />
      <Suspense>
        <CruiseSearch />
      </Suspense>
    </main>
  );
}
