import { TravelPlanner } from "@/components/travel-planner";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function TravelPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Travel Planner"
        description="Get AI-powered recommendations for your next trip."
      />
      <TravelPlanner />
    </LayoutWrapper>
  );
}
