import Link from "next/link";
import {
  HeartPulse,
  Landmark,
  Plane,
  Bot,
  Compass,
  Home,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { PageHeader } from "@/components/page-header";

const features = [
  {
    title: "Travel",
    description: "Plan your next family adventure.",
    href: "/travel",
    icon: <Plane className="h-8 w-8 text-accent" />,
  },
  {
    title: "Finance",
    description: "Manage your family's finances.",
    href: "/finance",
    icon: <Landmark className="h-8 w-8 text-accent" />,
  },
  {
    title: "Health",
    description: "Keep track of your family's health.",
    href: "/health",
    icon: <HeartPulse className="h-8 w-8 text-accent" />,
  },
  {
    title: "Web Agent",
    description: "Interact with websites using AI.",
    href: "/web-agent",
    icon: <Bot className="h-8 w-8 text-accent" />,
  },
];

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Compass className="size-8 text-primary" />
              <span className="text-lg font-semibold text-primary">
                Family Navigator
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <MainNav />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="relative ml-auto flex-1 md:grow-0">
              {/* Optional Search Bar */}
            </div>
            <UserNav />
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0">
            <PageHeader
              title="Dashboard"
              description="Welcome to your family's central hub."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card
                  key={feature.href}
                  className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
