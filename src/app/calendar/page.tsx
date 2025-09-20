
"use client";

import { FamilyCalendar } from "@/components/family-calendar";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import type { FamilyMember } from "@/lib/types";
import { useCalendar } from "@/hooks/use-calendar";
import { NewEventDialog } from "@/components/new-event-dialog";
import { cn } from "@/lib/utils";

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
          <NewEventDialog />

          <div className="flex flex-col gap-1">
             {(["day", "workWeek", "week", "month"] as const).map((v) => (
                <Button
                    key={v}
                    variant={view === v ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setView(v)}
                >
                    {v === "workWeek" ? "Work Week" : v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2 px-2">Show Calendars</h4>
            {familyMembers.map((calendar) => (
              <Button
                key={calendar}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => toggleCalendar(calendar)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    !activeCalendars.includes(calendar) && "opacity-0"
                  )}
                />
                <span>{calendar}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="h-[calc(100vh-12rem)]">
          <FamilyCalendar />
        </div>
      </div>
    </LayoutWrapper>
  );
}
