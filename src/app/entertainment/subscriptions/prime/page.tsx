
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function PrimePage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Prime Video"
        description="Manage your Prime Video subscription."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Prime Video integration coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    