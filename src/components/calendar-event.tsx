
"use client";

import type { FamilyMember } from "@/lib/types";
import { differenceInMinutes, getMinutes, getHours, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendar: FamilyMember | "Family";
  color: "blue" | "green" | "purple" | "orange";
};

type EventProps = {
  event: CalendarEvent;
};

const colorClasses = {
  blue: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700",
  green: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700",
  purple: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700",
  orange: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700",
};

export function Event({ event }: EventProps) {
  return (
    <div
      className={`rounded-md border p-1.5 text-xs font-medium leading-tight ${
        colorClasses[event.color]
      }`}
    >
      <p className="truncate">{event.title}</p>
    </div>
  );
}

export function TimelineEvent({ event }: EventProps) {
  const HOUR_HEIGHT = 48; // Corresponds to h-12 in Tailwind

  const startMinutes = differenceInMinutes(event.start, startOfDay(event.start));
  const endMinutes = differenceInMinutes(event.end, startOfDay(event.end));

  const top = (startMinutes / 60) * HOUR_HEIGHT;
  const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;

  return (
    <div
      className={cn(
        "absolute left-1 right-1 z-10 rounded-md p-1 text-xs shadow-md overflow-hidden",
        "bg-primary/80 text-primary-foreground"
      )}
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      <p className="font-medium truncate">{event.title}</p>
       <div className="text-[10px] opacity-80">
        {event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} -{" "}
        {event.end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
      </div>
    </div>
  );
}

