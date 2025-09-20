"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, HeartPulse, Home, Landmark, Plane } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: <Home /> },
  { href: "/travel", label: "Travel", icon: <Plane /> },
  { href: "/finance", label: "Finance", icon: <Landmark /> },
  { href: "/health", label: "Health", icon: <HeartPulse /> },
  { href: "/web-agent", label: "Web Agent", icon: <Bot /> },
];

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-2", className)} {...props}>
      {links.map((link) => (
        <Link key={link.href} href={link.href} passHref>
          <SidebarMenuButton
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            {link.icon}
            <span>{link.label}</span>
          </SidebarMenuButton>
        </Link>
      ))}
    </nav>
  );
}
