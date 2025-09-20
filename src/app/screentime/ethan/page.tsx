
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function EthanScreenTimePage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Ethan's Screen Time"
        description="Tracking usage for iPad, Oculus, and Switch."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Screen time tracking UI coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    