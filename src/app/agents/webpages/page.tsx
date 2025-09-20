import { WebAgentForm } from "@/components/web-agent-form";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function WebpagesAgentPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Webpages Agent"
        description="Ask questions about a website using AI."
      />
      <WebAgentForm />
    </LayoutWrapper>
  );
}
