
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import * as React from "react";

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Chat" },
  { href: "/calendar", label: "Calendar" },
];

const travelLinks: { title: string; href: string; description: string }[] = [
  {
    title: "Cruises",
    href: "/travel",
    description: "Plan and book your next cruise adventure.",
  },
  {
    title: "Road Trips",
    href: "/travel",
    description: "Discover scenic routes and plan your journey.",
  },
  {
    title: "Lodging",
    href: "/travel",
    description: "Find and book accommodations for your trip.",
  },
];

const financeLinks: { title: string; href: string; description: string }[] = [
    {
        title: "Smart Summary",
        href: "/finance",
        description: "Get an AI-powered summary of your finances."
    },
    {
        title: "Savings Projections",
        href: "/finance",
        description: "Project your retirement and college savings."
    }
]

const healthLinks: { title: string; href: string; description: string }[] = [
    {
        title: "Log Vitals",
        href: "/health",
        description: "Record daily health metrics for your family."
    },
    {
        title: "View Trends",
        href: "/health",
        description: "Analyze health data and spot trends over time."
    }
]

const agentLinks: { title: string; href: string; description: string }[] = [
  {
    title: "Travel Agent",
    href: "/agents/travel",
    description: "Plan trips, find deals, and get travel recommendations.",
  },
  {
    title: "Finance Agent",
    href: "/agents/finance",
    description: "Analyze spending, track investments, and get financial advice.",
  },
  {
    title: "Health Agent",
    href: "/agents/health",
    description: "Monitor health data, get fitness tips, and track wellness goals.",
  },
  {
    title: "Webpages Agent",
    href: "/agents/webpages",
    description: "Interact with websites to extract information and perform tasks.",
  },
];

const screenTimeLinks: { title: string; href: string; description: string }[] = [
    {
        title: "Ethan's Usage",
        href: "/screentime/ethan",
        description: "Track usage for iPad, Oculus, and Switch."
    },
    {
        title: "Elle's Usage",
        href: "/screentime/elle",
        description: "Track usage for iPad, Oculus, and Switch."
    }
];

const weatherLinks: { title: string; href: string; description: string }[] = [
    {
        title: "Forecast",
        href: "/weather/forecast",
        description: "View the latest weather forecast."
    },
    {
        title: "Radar",
        href: "/weather/radar",
        description: "See real-time weather radar maps."
    }
];

const entertainmentLinks: { title: string; href: string; description: string }[] = [
    { title: "Netflix", href: "/entertainment/subscriptions/netflix", description: "Manage your Netflix subscription." },
    { title: "Hulu", href: "/entertainment/subscriptions/hulu", description: "Manage your Hulu subscription." },
    { title: "Prime", href: "/entertainment/subscriptions/prime", description: "Manage your Prime Video subscription." },
    { title: "Max", href: "/entertainment/subscriptions/max", description: "Manage your Max subscription." },
    { title: "Apple TV+", href: "/entertainment/subscriptions/apple", description: "Manage your Apple TV+ subscription." },
    { title: "Movies", href: "/entertainment/movies", description: "Track movies to watch." },
    { title: "Sports", href: "/entertainment/sports", description: "Follow your favorite sports." },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("hidden items-center space-x-4 md:flex lg:space-x-6", className)}
      {...props}
    >
      <NavigationMenu>
        <NavigationMenuList>
          {mainNavLinks.map((link) => (
             <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  href={link.href}
                  active={pathname === link.href}
                  className={cn(navigationMenuTriggerStyle(), "text-base")}
                >
                  {link.label}
                </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Screen Time</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {screenTimeLinks.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Weather</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {weatherLinks.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Entertainment</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {entertainmentLinks.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
              <NavigationMenuTrigger>AI Agents</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {agentLinks.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

    