
"use client";

import { FamilyCalendar } from "@/components/family-calendar";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function CalendarPage() {
  const { activeCalendars, toggleCalendar, view, setView } = useCalendar();

  return (
    <LayoutWrapper>
      <PageHeader
        title="Calendar"
        description="Organize your family's schedule."
      />
      <div className="grid grid-cols-[200px_1fr] gap-6">
        <div className="flex flex-col gap-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>

          <div className="flex flex-col gap-2">
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
        <div className="h-[calc(100vh-12rem)]">
          <FamilyCalendar />
        </div>
      </div>
    </LayoutWrapper>
  );
}
