
"use client";

import { Check, Plus } from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { FamilyMember } from "@/lib/types";
import { useCalendar } from "@/hooks/use-calendar";

const familyMembers: (FamilyMember | "Family")[] = [
  "Family",
  "Adam",
  "Holly",
  "Ethan",
  "Elle",
];

export function CalendarControlSidebar() {
  const { 
    activeCalendars, 
    toggleCalendar,
    view,
    setView
  } = useCalendar();
  
  return (
    <div className="flex flex-col h-full">
      <SidebarHeader>
        <Button className="w-full">
          <Plus className="h-4 w-4" />
          <span>Add event</span>
        </Button>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <div className="p-2 flex flex-col gap-2">
            {(["day", "workWeek", "week", "month"] as (typeof view)[]).map(
                (v) => (
                <Button
                    key={v}
                    variant={view === v ? "secondary" : "ghost"}
                    onClick={() => setView(v)}
                    className={cn("justify-start", view === v && "shadow-sm")}
                >
                    {v === "workWeek"
                    ? "Work Week"
                    : v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
                )
            )}
        </div>

        <div className="p-2 mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <span>Select Calendar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <div className="font-semibold">Show Calendars</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {familyMembers.map((calendar) => (
                <DropdownMenuItem
                  key={calendar}
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => toggleCalendar(calendar)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !activeCalendars.includes(calendar) && "opacity-0"
                    )}
                  />
                  <span>{calendar}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </div>
  );
}
