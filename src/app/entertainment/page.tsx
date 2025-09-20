
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function EntertainmentPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Entertainment"
        description="Manage your subscriptions and watchlists."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Entertainment dashboard coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    