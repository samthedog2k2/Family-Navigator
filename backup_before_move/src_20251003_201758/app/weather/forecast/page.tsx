
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function ForecastPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Weather Forecast"
        description="View the latest weather forecast."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Forecast UI coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    