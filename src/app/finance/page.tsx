import { FinanceTools } from "@/components/finance-tools";
import { PageHeader } from "@/components/page-header";

export default function FinancePage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <PageHeader
        title="Financial Tools"
        description="Analyze your finances and plan for the future."
      />
      <FinanceTools />
    </main>
  );
}
