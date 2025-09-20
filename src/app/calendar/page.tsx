
"use client";

import { FamilyCalendar } from "@/components/family-calendar";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useCalendar } from "@/hooks/use-calendar";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const calendarList: { id: "Family" | "Adam" | "Holly" | "Ethan" | "Elle"; color: string }[] = [
  { id: "Family", color: "bg-blue-500" },
  { id: "Adam", color: "bg-green-500" },
  { id: "Holly", color: "bg-purple-500" },
  { id: "Ethan", color: "bg-orange-500" },
  { id: "Elle", color: "bg-pink-500" },
];


export default function CalendarPage() {
  const { activeCalendars, toggleCalendar } = useCalendar();

  return (
    <LayoutWrapper>
      <PageHeader
        title="Calendar"
        description="Organize your family's schedule."
      />
      <div className="grid grid-cols-[200px_1fr] gap-6">
        <div className="flex flex-col gap-4">
          <Accordion type="single" collapsible defaultValue="calendars" className="w-full">
            <AccordionItem value="calendars" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
                Show Calendars
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 pt-2">
                  {calendarList.map((calendar) => (
                    <Button
                      key={calendar.id}
                      variant="ghost"
                      className="w-full justify-start h-8 px-2"
                      onClick={() => toggleCalendar(calendar.id)}
                    >
                      <div className="flex items-center gap-2">
                         <div
                          className={cn(
                            "w-5 h-5 rounded-sm border border-primary flex items-center justify-center",
                            activeCalendars.includes(calendar.id) && calendar.color.replace('bg-', 'bg-')
                          )}
                        >
                          {activeCalendars.includes(calendar.id) && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className={cn(calendar.color.replace('bg-','text-'))}>{calendar.id}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="h-[calc(100vh-12rem)]">
          <FamilyCalendar />
        </div>
      </div>
    </LayoutWrapper>
  );
}
