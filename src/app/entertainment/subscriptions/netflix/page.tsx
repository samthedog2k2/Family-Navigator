
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function NetflixPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Netflix"
        description="Manage your Netflix subscription."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Netflix integration coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    