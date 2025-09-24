import { CruiseSearch } from "@/components/cruise-search";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";

export default function TravelPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="AI-Powered Cruise Search"
        description="Find your next cruise adventure. Describe your ideal trip and let our AI find the best options for you."
      />
      <Suspense>
        <CruiseSearch />
      </Suspense>
    </LayoutWrapper>
  );
}
