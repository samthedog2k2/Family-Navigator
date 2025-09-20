import Link from "next/link";
import {
  HeartPulse,
  Landmark,
  Plane,
  Bot,
  MessageCircle,
  Layers,
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
import { UserNav } from "@/components/user-nav";

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
    title: "Chat",
    description: "Chat with an AI to improve the app.",
    href: "/chat",
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Family Navigator
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Your compass for family life. All your family's needs,
                  organized in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="#">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Features
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A quick look at the tools available to you.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {features.map((feature) => (
                <div key={feature.href} className="grid gap-1">
                   <div className="flex items-center gap-4">
                    {feature.icon}
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                   <Button variant="link" asChild className="p-0 justify-start">
                    <Link href={feature.href}>Learn More</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
