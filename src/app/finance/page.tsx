import { FinanceTools } from "@/components/finance-tools";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function FinancePage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Financial Tools"
        description="Analyze your finances and plan for the future."
      />
      <FinanceTools />
    </LayoutWrapper>
  );
}
