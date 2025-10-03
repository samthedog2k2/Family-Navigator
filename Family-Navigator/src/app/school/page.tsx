
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { School } from "lucide-react";

export default function SchoolPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="School"
        description="Monitor your family's school activities."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Link href="/school/ethan">
            <CardHeader className="flex-row items-center gap-4">
              <School className="h-8 w-8 text-primary" />
              <CardTitle>Ethan's School Page</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>View grades, assignments, and schedule.</CardDescription>
            </CardContent>
          </Link>
        </Card>
        <Card>
          <Link href="/school/elle">
            <CardHeader className="flex-row items-center gap-4">
              <School className="h-8 w-8 text-primary" />
              <CardTitle>Elle's School Page</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>View grades, assignments, and schedule.</CardDescription>
            </CardContent>
          </Link>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
