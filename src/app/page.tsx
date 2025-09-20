import Link from "next/link";
import Image from "next/image";
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
import { placeholderImages } from "@/lib/placeholder-images.json";

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
    title: "Web Agent",
    description: "Interact with websites using AI.",
    href: "/web-agent",
    icon: <Bot className="h-8 w-8 text-primary" />,
  },
  {
    title: "Chat Agent",
    description: "Chat with an AI to improve the app.",
    href: "/chat",
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
  },
];

const heroImage = placeholderImages.find(p => p.id === 'hero-family');

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative w-full h-[60vh] text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center bg-black/50 p-4">
            <h1 className="text-4xl md:text-6xl font-bold">Family Navigator</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">
              Your compass for family life. All your family's needs, organized in one place.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/travel">Get Started</Link>
            </Button>
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
