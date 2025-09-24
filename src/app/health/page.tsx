import { HealthTracker } from "@/components/health-tracker";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function HealthPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Health Tracker"
        description="Monitor and record health vitals for your family."
      />
      <HealthTracker />
    </LayoutWrapper>
  );
}
