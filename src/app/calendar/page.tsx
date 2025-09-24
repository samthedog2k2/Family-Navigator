"use client";

import { CalendarProvider } from "@/hooks/use-calendar";
import { FamilyCalendar } from "@/components/family-calendar";

export default function CalendarPage() {
  return (
    <CalendarProvider>
        <FamilyCalendar />
    </CalendarProvider>
  );
}
