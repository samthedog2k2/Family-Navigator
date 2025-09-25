import { SecureAgentForm } from "@/components/secure-agent-form";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function WebpagesAgentPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Secure Webpages Agent"
        description="Ask an AI agent to securely log into a website and retrieve information."
      />
      <SecureAgentForm />
    </LayoutWrapper>
  );
}
