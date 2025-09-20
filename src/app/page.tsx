
"use client";

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
import { Header } from "@/components/header";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

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
    title: "Agents",
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
];

export default function HomePage() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const router = useRouter();

  const handleCheckboxChange = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleBuildPage = () => {
    if (selectedFeatures.length === 0) {
      // Or show a toast message
      return;
    }
    if (selectedFeatures.length === 1) {
      const feature = features.find((f) => f.id === selectedFeatures[0]);
      if (feature) {
        router.push(feature.href);
      }
    } else {
      const query = selectedFeatures.join(",");
      router.push(`/dashboard?features=${query}`);
    }
  };

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
                  Build Your Dashboard
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Select the features you want to see on your custom page.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="grid gap-2 relative rounded-lg border p-4 bg-card"
                >
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Button
                      variant="link"
                      asChild
                      className="p-0 justify-start"
                    >
                      <Link href={feature.href}>Learn More</Link>
                    </Button>
                     <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`checkbox-${feature.id}`}
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={() => handleCheckboxChange(feature.id)}
                      />
                      <Label htmlFor={`checkbox-${feature.id}`} className="cursor-pointer">
                        Add
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
             <div className="text-center mt-8">
                <Button
                  size="lg"
                  onClick={handleBuildPage}
                  disabled={selectedFeatures.length === 0}
                >
                  Build Your Page
                </Button>
              </div>
          </div>
        </section>
      </main>
    </div>
  );
}
