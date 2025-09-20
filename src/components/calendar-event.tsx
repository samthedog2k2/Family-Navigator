
"use client";

import type { FamilyMember } from "@/lib/types";
import { differenceInMinutes, getMinutes, getHours } from "date-fns";

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

const timelineColorClasses = {
  blue: "bg-blue-500 border-blue-700",
  green: "bg-green-500 border-green-700",
  purple: "bg-purple-500 border-purple-700",
  orange: "bg-orange-500 border-orange-700",
};

const TOTAL_MINUTES_IN_DAY = 24 * 60;

export function TimelineEvent({ event }: EventProps) {
  const startMinutes = getHours(event.start) * 60 + getMinutes(event.start);
  const durationMinutes = differenceInMinutes(event.end, event.start);

  const top = (startMinutes / TOTAL_MINUTES_IN_DAY) * 100;
  const height = (durationMinutes / TOTAL_MINUTES_IN_DAY) * 100;
  
  return (
    <div
      className={`absolute left-2 right-2 z-10 rounded-lg border p-2 text-white shadow-md ${timelineColorClasses[event.color]}`}
      style={{
        top: `${top}%`,
        height: `${height}%`,
      }}
    >
      <p className="text-xs font-bold">{event.title}</p>
    </div>
  );
}
