
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function MoviesPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Movies"
        description="Track movies to watch."
      />
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20">
        <p className="text-muted-foreground">Movie tracking coming soon</p>
      </div>
    </LayoutWrapper>
  );
}

    