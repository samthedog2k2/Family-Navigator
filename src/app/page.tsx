
"use client";

import Link from "next/link";
import {
  HeartPulse,
  Landmark,
  Plane,
  Bot,
  MessageCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Header } from "@/components/header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    id: "travel",
    title: "Travel",
    description: "Plan your next family adventure.",
    href: "/travel",
    icon: <Plane className="h-8 w-8 text-primary" />,
  },
  {
    id: "finance",
    title: "Finance",
    description: "Manage your family's finances.",
    href: "/finance",
    icon: <Landmark className="h-8 w-8 text-primary" />,
  },
  {
    id: "health",
    title: "Health",
    description: "Keep track of your family's health.",
    href: "/health",
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
  },
  {
    id: "agents",
    title: "AI Agents",
    description: "Interact with AI agents.",
    href: "/agents/webpages",
    icon: <Bot className="h-8 w-8 text-primary" />,
  },
  {
    id: "chat",
    title: "Chat",
    description: "Chat with an AI to improve the app.",
    href: "/chat",
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Organize your family's schedule.",
    href: "/calendar",
    icon: <CalendarIcon className="h-8 w-8 text-primary" />,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  What would you like to do today?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose from the features below to get started.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {features.map((feature) => (
                 <Link href={feature.href} key={feature.id} className="block">
                    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                      <CardHeader className="flex-row items-center gap-4">
                          {feature.icon}
                          <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <CardDescription>{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
