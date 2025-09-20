
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

const schoolLinks: { title: string; href: string; description: string }[] = [
    {
        title: "Ethan's Page",
        href: "/school/ethan",
        description: "View Ethan's school schedule, grades, and assignments."
    },
    {
        title: "Elle's Page",
        href: "/school/elle",
        description: "View Elle's school schedule, grades, and assignments."
    }
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
    { title: "Subscriptions", href: "/entertainment", description: "Manage your streaming subscriptions." },
    { title: "Netflix", href: "/entertainment/subscriptions/netflix", description: "Manage your Netflix subscription." },
    { title: "Hulu", href: "/entertainment/subscriptions/hulu", description: "Manage your Hulu subscription." },
    { title: "Prime", href: "/entertainment/subscriptions/prime", description: "Manage your Prime Video subscription." },
    { title: "Max", href: "/entertainment/subscriptions/max", description: "Manage your Max subscription." },
    { title: "Apple TV+", href: "/entertainment/subscriptions/apple", description: "Manage your Apple TV+ subscription." },
    { title: "Movies", href: "/entertainment/movies", description: "Track movies to watch." },
    { title: "Sports", href: "/entertainment/sports", description: "Follow your favorite sports." },
];

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
                  className={navigationMenuTriggerStyle()}
                >
                  {link.label}
                </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuTrigger>School</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {schoolLinks.map((component) => (
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

    