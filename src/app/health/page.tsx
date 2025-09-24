import { HealthTracker } from "@/components/health-tracker";
import { PageHeader } from "@/components/page-header";

export default function HealthPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <PageHeader
        title="Health Tracker"
        description="Monitor and record health vitals for your family."
      />
      <HealthTracker />
    </main>
  );
}
