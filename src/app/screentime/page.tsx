
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function ScreenTimePage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Screen Time"
        description="Monitor and manage your family's device usage."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Link href="/screentime/ethan">
            <CardHeader className="flex-row items-center gap-4">
              <Clock className="h-8 w-8 text-primary" />
              <CardTitle>Ethan's Screen Time</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>View usage for iPad, Oculus, and Switch.</CardDescription>
            </CardContent>
          </Link>
        </Card>
        <Card>
          <Link href="/screentime/elle">
            <CardHeader className="flex-row items-center gap-4">
              <Clock className="h-8 w-8 text-primary" />
              <CardTitle>Elle's Screen Time</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>View usage for iPad, Oculus, and Switch.</CardDescription>
            </CardContent>
          </Link>
        </Card>
      </div>
    </LayoutWrapper>
  );
}

    