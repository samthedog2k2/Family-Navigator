"use client";

import { CalendarProvider } from "@/hooks/use-calendar";
import { FamilyCalendar } from "@/components/family-calendar";
import { LayoutWrapper } from "@/components/layout-wrapper";

export default function CalendarPage() {
  return (
    <CalendarProvider>
      <LayoutWrapper>
        <FamilyCalendar />
      </LayoutWrapper>
    </CalendarProvider>
  );
}
