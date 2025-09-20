
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function EthanSchoolPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Ethan's School"
        description="Tracking grades, assignments, and schedule."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">School tracking UI coming soon</p>
      </div>
    </LayoutWrapper>
  );
}
