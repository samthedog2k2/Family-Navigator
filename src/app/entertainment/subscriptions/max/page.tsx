
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function MaxPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Max"
        description="Manage your Max subscription."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Max integration coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    