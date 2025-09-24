
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Clapperboard } from "lucide-react";
import Link from "next/link";

const subscriptionLinks = [
    { title: "Netflix", href: "/entertainment/subscriptions/netflix", description: "Manage your Netflix subscription." },
    { title: "Hulu", href: "/entertainment/subscriptions/hulu", description: "Manage your Hulu subscription." },
    { title: "Prime Video", href: "/entertainment/subscriptions/prime", description: "Manage your Prime Video subscription." },
    { title: "Max", href: "/entertainment/subscriptions/max", description: "Manage your Max subscription." },
    { title: "Apple TV+", href: "/entertainment/subscriptions/apple", description: "Manage your Apple TV+ subscription." },
];

export default function EntertainmentPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <PageHeader
        title="Entertainment"
        description="Manage your subscriptions and watchlists."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptionLinks.map((link) => (
            <Card key={link.title}>
                <Link href={link.href}>
                    <CardHeader className="flex-row items-center gap-4">
                    <Clapperboard className="h-8 w-8 text-primary" />
                    <CardTitle>{link.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <CardDescription>{link.description}</CardDescription>
                    </CardContent>
                </Link>
            </Card>
        ))}
      </div>
    </main>
  );
}
