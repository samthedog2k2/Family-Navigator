
"use client";

import type { CalendarEvent as TCalendarEvent } from "@/hooks/use-calendar";
import { differenceInMinutes, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

const colorClasses: Record<string, string> = {
  Family: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700",
  Adam: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700",
  Holly: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700",
  Ethan: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700",
  Elle: "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/50 dark:text-pink-200 dark:border-pink-700",
};

export function Event({ event }: { event: TCalendarEvent }) {
  const colorClass = colorClasses[event.calendar] || "bg-gray-100 text-gray-800 border-gray-300";
  return (
    <div
      className={cn("rounded-md border p-1.5 text-xs font-medium leading-tight", colorClass)}
    >
      <p className="truncate">{event.title}</p>
    </div>
  );
}

export function TimelineEvent({ event }: { event: TCalendarEvent & { slotIndex?: number; slotCount?: number } }) {
  const HALF_HOUR_HEIGHT = 24; // 30min = 24px

  const startMinutes = differenceInMinutes(event.start, startOfDay(event.start));
  const endMinutes = differenceInMinutes(event.end, startOfDay(event.end));

  const top = (startMinutes / 30) * HALF_HOUR_HEIGHT;
  const height = ((endMinutes - startMinutes) / 30) * HALF_HOUR_HEIGHT;

  // Collision layout
  const slotIndex = event.slotIndex ?? 0;
  const slotCount = event.slotCount ?? 1;
  const width = 100 / slotCount;
  const left = width * slotIndex;

  const timelineColorClass: Record<string, string> = {
    Family: "bg-blue-500 border-blue-700",
    Adam: "bg-green-500 border-green-700",
    Holly: "bg-purple-500 border-purple-700",
    Ethan: "bg-orange-500 border-orange-700",
    Elle: "bg-pink-500 border-pink-700",
  };
  
  const colorClass = timelineColorClass[event.calendar] || "bg-gray-500 border-gray-700";

  return (
    <div
      className={cn(
        "absolute rounded-md p-1 text-xs shadow-md overflow-hidden text-white border",
        colorClass
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
