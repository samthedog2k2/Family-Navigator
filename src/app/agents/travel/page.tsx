import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function TravelAgentPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Travel Agent"
        description="Configure your AI-powered travel agent."
      />
      {/* Drag and drop UI will go here */}
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Drag and Drop UI coming soon</p>
      </div>
    </LayoutWrapper>
  );
}
