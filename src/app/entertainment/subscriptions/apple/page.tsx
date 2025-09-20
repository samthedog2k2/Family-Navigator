
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function ApplePage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Apple TV+"
        description="Manage your Apple TV+ subscription."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Apple TV+ integration coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    