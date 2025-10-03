
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function RadarPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Weather Radar"
        description="See real-time weather radar maps."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Radar UI coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    