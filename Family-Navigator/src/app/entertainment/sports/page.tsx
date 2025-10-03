
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function SportsPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Sports"
        description="Follow your favorite sports."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Sports tracking coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    