
"use client";

import * as React from "react";
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

// ---------- Strong typing ----------
type NavLink = {
  title: string;
  href: string;
  description: string;
  isLeaf: true;
};

type NavMenu = {
  title: string;
  description: string;
  isLeaf: false;
  children: (NavLink & { isOverview?: boolean })[];
};

type NavItem = NavLink | NavMenu;

const isNavMenu = (item: NavItem): item is NavMenu => !item.isLeaf;

// ---------- Menu data ----------
const mainNavItems: NavItem[] = [
  { title: "Home", href: "/", description: "Go to homepage", isLeaf: true },
  { title: "Chat", href: "/chat", description: "Chat with an AI", isLeaf: true },
  { title: "Calendar", href: "/calendar", description: "View family calendar", isLeaf: true },
  {
    title: "School",
    isLeaf: false,
    description: "Monitor your family's school activities.",
    children: [
       {
        title: "Overview",
        href: "/school",
        description: "View the main school dashboard.",
        isLeaf: true,
        isOverview: true,
      },
      {
        title: "Ethan's Page",
        href: "/school/ethan",
        description: "View Ethan's school schedule, grades, and assignments.",
        isLeaf: true,
      },
      {
        title: "Elle's Page",
        href: "/school/elle",
        description: "View Elle's school schedule, grades, and assignments.",
        isLeaf: true,
      }
    ]
  },
  {
    title: "Screen Time",
    isLeaf: false,
    description: "Monitor and manage your family's device usage.",
    children: [
      {
        title: "Overview",
        href: "/screentime",
        description: "View the main screen time dashboard.",
        isLeaf: true,
        isOverview: true,
      },
      {
        title: "Ethan's Usage",
        href: "/screentime/ethan",
        description: "Track usage for iPad, Oculus, and Switch.",
        isLeaf: true,
      },
      {
        title: "Elle's Usage",
        href: "/screentime/elle",
        description: "Track usage for iPad, Oculus, and Switch.",
        isLeaf: true,
      }
    ]
  },
  {
    title: "Weather",
    isLeaf: false,
    description: "Check the local forecast and radar.",
    children: [
       {
        title: "Overview",
        href: "/weather",
        description: "View the main weather dashboard.",
        isLeaf: true,
        isOverview: true,
      },
       {
        title: "Forecast",
        href: "/weather/forecast",
        description: "View the latest weather forecast.",
        isLeaf: true,
      },
      {
        title: "Radar",
        href: "/weather/radar",
        description: "See real-time weather radar maps.",
        isLeaf: true,
      }
    ]
  },
  {
    title: "Entertainment",
    isLeaf: false,
    description: "Manage your subscriptions and watchlists.",
    children: [
      { title: "Overview", href: "/entertainment", description: "Manage your streaming subscriptions and watchlists.", isLeaf: true, isOverview: true },
      { title: "Netflix", href: "/entertainment/subscriptions/netflix", description: "Manage your Netflix subscription.", isLeaf: true, },
      { title: "Hulu", href: "/entertainment/subscriptions/hulu", description: "Manage your Hulu subscription.", isLeaf: true, },
      { title: "Prime", href: "/entertainment/subscriptions/prime", description: "Manage your Prime Video subscription.", isLeaf: true, },
      { title: "Max", href: "/entertainment/subscriptions/max", description: "Manage your Max subscription.", isLeaf: true, },
      { title: "Apple TV+", href: "/entertainment/subscriptions/apple", description: "Manage your Apple TV+ subscription.", isLeaf: true, },
      { title: "Movies", href: "/entertainment/movies", description: "Track movies to watch.", isLeaf: true, },
      { title: "Sports", href: "/entertainment/sports", description: "Follow your favorite sports.", isLeaf: true, },
    ]
  },
  {
    title: "AI Agents",
    isLeaf: false,
    description: "Interact with AI agents.",
    children: [
      {
        title: "Webpages Agent",
        href: "/agents/webpages",
        description: "Interact with websites to extract information and perform tasks.",
        isLeaf: true,
        isOverview: true,
      },
      {
        title: "Travel Agent",
        href: "/agents/travel",
        description: "Plan trips, find deals, and get travel recommendations.",
        isLeaf: true,
      },
      {
        title: "Finance Agent",
        href: "/agents/finance",
        description: "Analyze spending, track investments, and get financial advice.",
        isLeaf: true,
      },
      {
        title: "Health Agent",
        href: "/agents/health",
        description: "Monitor health data, get fitness tips, and track wellness goals.",
        isLeaf: true,
      },
    ]
  }
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
          {mainNavItems.map((item) => (
            <NavigationMenuItem key={item.title}>
              {isNavMenu(item) ? (
                <>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.children.map((child) => (
                        <ListItem
                          key={child.title}
                          title={child.title}
                          href={child.href}
                        >
                          {child.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                 <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={pathname === item.href}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
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
  );
});
ListItem.displayName = "ListItem";

    