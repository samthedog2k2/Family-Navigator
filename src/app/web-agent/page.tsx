import { WebAgentForm } from "@/components/web-agent-form";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function WebAgentPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Web Agent"
        description="Ask questions about a website using AI."
      />
      <WebAgentForm />
    </LayoutWrapper>
  );
}
