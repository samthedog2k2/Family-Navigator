
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

// Strong types for navigation items
type NavLink = {
  title: string;
  href: string;
  description: string;
  isLeaf: true;
};

type NavMenu = {
  title: string;
  isLeaf: false;
  children: {
    title: string;
    href?: string; // href is optional now
    description: string;
  }[];
};

type NavItem = NavLink | NavMenu;

const mainNavItems: NavItem[] = [
  { title: "Home", href: "/", description: "Go to homepage", isLeaf: true },
  { title: "Chat", href: "/chat", description: "Chat with an AI", isLeaf: true },
  { title: "Calendar", href: "/calendar", description: "View family calendar", isLeaf: true },
  {
    title: "School",
    isLeaf: false,
    children: [
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
    ]
  },
  {
    title: "Screen Time",
    isLeaf: false,
    children: [
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
    ]
  },
  {
    title: "Weather",
    isLeaf: false,
    children: [
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
    ]
  },
  {
    title: "Entertainment",
    isLeaf: false,
    children: [
      { title: "Subscriptions", href: "/entertainment", description: "Manage your streaming subscriptions." },
      { title: "Netflix", href: "/entertainment/subscriptions/netflix", description: "Manage your Netflix subscription." },
      { title: "Hulu", href: "/entertainment/subscriptions/hulu", description: "Manage your Hulu subscription." },
      { title: "Prime", href: "/entertainment/subscriptions/prime", description: "Manage your Prime Video subscription." },
      { title: "Max", href: "/entertainment/subscriptions/max", description: "Manage your Max subscription." },
      { title: "Apple TV+", href: "/entertainment/subscriptions/apple", description: "Manage your Apple TV+ subscription." },
      { title: "Movies", href: "/entertainment/movies", description: "Track movies to watch." },
      { title: "Sports", href: "/entertainment/sports", description: "Follow your favorite sports." },
    ]
  },
  {
    title: "AI Agents",
    isLeaf: false,
    children: [
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
              {item.isLeaf ? (
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={pathname === item.href}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              ) : (
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
  const content = (
    <div
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
    >
      <div className="text-sm font-medium leading-none">{title}</div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {children}
      </p>
    </div>
  );

  return (
    <li>
      {href ? (
        <NavigationMenuLink asChild>
          <Link
            href={href}
            ref={ref}
            {...props}
          >
            {content}
          </Link>
        </NavigationMenuLink>
      ) : (
        content
      )}
    </li>
  );
});
ListItem.displayName = "ListItem"
