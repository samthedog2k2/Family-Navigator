import Link from "next/link";
import {
  HeartPulse,
  Landmark,
  Plane,
  Bot,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/header";

const features = [
  {
    title: "Travel",
    description: "Plan your next family adventure.",
    href: "/travel",
    icon: <Plane className="h-8 w-8 text-primary" />,
  },
  {
    title: "Finance",
    description: "Manage your family's finances.",
    href: "/finance",
    icon: <Landmark className="h-8 w-8 text-primary" />,
  },
  {
    title: "Health",
    description: "Keep track of your family's health.",
    href: "/health",
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
  },
  {
    title: "Agents",
    description: "Interact with AI agents.",
    href: "/agents/webpages",
    icon: <Bot className="h-8 w-8 text-primary" />,
  },
  {
    title: "Chat Agent",
    description: "Chat with an AI to improve the app.",
    href: "/chat",
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Family Navigator</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Your compass for family life. All your family's needs, organized in one place.
              </p>
              <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/travel">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
             <h2 className="text-3xl font-bold tracking-tighter text-center mb-10">
              Features
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.href}
                  className="transform-gpu transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Link href={feature.href} className="block h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-bold">
                        {feature.title}
                      </CardTitle>
                      {feature.icon}
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
