
"use client";

import type { CalendarEvent as TCalendarEvent } from "@/hooks/use-calendar";
import { differenceInMinutes, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

type EventProps = {
  event: TCalendarEvent & { slotIndex?: number; slotCount?: number };
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
  const HALF_HOUR_HEIGHT = 24; // Corresponds to h-6 in Tailwind for each 30-min slot

  const startMinutes = differenceInMinutes(event.start, startOfDay(event.start));
  const endMinutes = differenceInMinutes(event.end, startOfDay(event.end));

  const top = (startMinutes / 30) * HALF_HOUR_HEIGHT;
  const height = ((endMinutes - startMinutes) / 30) * HALF_HOUR_HEIGHT;

  // Collision layout
  const slotIndex = event.slotIndex ?? 0;
  const slotCount = event.slotCount ?? 1;
  const width = 100 / slotCount;
  const left = width * slotIndex;

  return (
    <div
      className={cn(
        "absolute rounded-md p-1 text-xs shadow-md overflow-hidden",
        "bg-primary/80 text-primary-foreground"
      )}
      style={{ top, height, left: `${left}%`, width: `${width}%` }}
    >
      <p className="font-medium truncate">{event.title}</p>
       <div className="text-[10px] opacity-80">
        {event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} -{" "}
        {event.end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
      </div>
    </div>
  );
}
