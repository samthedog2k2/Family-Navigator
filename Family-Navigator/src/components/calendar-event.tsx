
"use client";

import type { CalendarEvent as TCalendarEvent } from "@/hooks/use-calendar";
import { differenceInMinutes, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

const colorClasses: Record<string, string> = {
  Family: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700",
  Adam: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700",
  Holly: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700",
  Ethan: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700",
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

type TimelineEventProps = {
  event: TCalendarEvent & { slotIndex?: number; slotCount?: number };
  onClick?: (event: TCalendarEvent) => void;
};


export function TimelineEvent({ event, onClick }: TimelineEventProps) {
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

  const timelineColorClass: Record<string, { bg: string, text: string, border: string }> = {
    Family: { bg: "bg-orange-500", text: "text-white", border: "border-orange-700" },
    Adam:   { bg: "bg-blue-500", text: "text-white", border: "border-blue-700" },
    Holly:  { bg: "bg-purple-500", text: "text-white", border: "border-purple-700" },
    Ethan:  { bg: "bg-green-500", text: "text-white", border: "border-green-700" },
    Elle:   { bg: "bg-pink-400", text: "text-black", border: "border-pink-600" },
  };
  
  const color = timelineColorClass[event.calendar] || { bg: "bg-gray-500", text: "text-white", border: "border-gray-700" };

  return (
    <div
      className={cn(
        "absolute rounded-md p-1 text-xs shadow-md overflow-hidden border cursor-pointer",
        "transition-all duration-150",
        "hover:brightness-90 focus:ring-2 focus:ring-offset-1 focus:ring-black",
        color.bg,
        color.text,
        color.border,
      )}
      style={{ top, height, left: `${left}%`, width: `${width}%` }}
      tabIndex={0}
      onClick={() => onClick?.(event)}
    >
      <p className="font-medium truncate">{event.title}</p>
       <div className="text-[10px] opacity-80">
        {event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} -{" "}
        {event.end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
      </div>
    </div>
  );
}
