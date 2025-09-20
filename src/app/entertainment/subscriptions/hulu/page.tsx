
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function HuluPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Hulu"
        description="Manage your Hulu subscription."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Hulu integration coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    