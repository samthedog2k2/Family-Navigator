
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function WeatherPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Weather"
        description="Check the local forecast and radar."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Weather UI coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    