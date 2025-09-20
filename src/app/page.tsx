import Link from "next/link";
import {
  HeartPulse,
  Landmark,
  Plane,
  Bot,
  CookingPot,
  Car,
  GraduationCap,
  Briefcase,
  MessageCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { PageHeader } from "@/components/page-header";
import { Header } from "@/components/header";

const features = [
  {
    title: "Travel",
    description: "Plan your next family adventure.",
    href: "/travel",
    icon: <Plane className="h-8 w-8 text-primary-foreground" />,
  },
  {
    title: "Finance",
    description: "Manage your family's finances.",
    href: "/finance",
    icon: <Landmark className="h-8 w-8 text-primary-foreground" />,
  },
  {
    title: "Health",
    description: "Keep track of your family's health.",
    href: "/health",
    icon: <HeartPulse className="h-8 w-8 text-primary-foreground" />,
  },
  {
    title: "Web Agent",
    description: "Interact with websites using AI.",
    href: "/web-agent",
    icon: <Bot className="h-8 w-8 text-primary-foreground" />,
  },
  {
    title: "Chat Agent",
    description: "Chat with an AI to improve the app.",
    href: "/chat",
    icon: <MessageCircle className="h-8 w-8 text-primary-foreground" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <PageHeader
          title="Dashboard"
          description="Welcome to your family's central hub."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.href}
              className="transform-gpu transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link href={feature.href}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold">
                    {feature.title}
                  </CardTitle>
                  {feature.icon}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
