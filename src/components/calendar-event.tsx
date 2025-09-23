
"use client";

import type { CalendarEvent as TCalendarEvent } from "@/hooks/use-calendar";
import { differenceInMinutes, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

// Centralized color configuration for all calendar event types
const calendarColorConfig: Record<string, { month: string; timeline: string }> = {
  Adam: {
    month: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700",
    timeline: "bg-blue-500 border-blue-700 text-white",
  },
  Holly: {
    month: "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/50 dark:text-pink-200 dark:border-pink-700",
    timeline: "bg-pink-500 border-pink-700 text-white",
  },
  Ethan: {
    month: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700",
    timeline: "bg-green-500 border-green-700 text-white",
  },
  Elle: {
    month: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700",
    timeline: "bg-purple-500 border-purple-700 text-white",
  },
  default: {
    month: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/50 dark:text-gray-200 dark:border-gray-700",
    timeline: "bg-gray-500 border-gray-700 text-white",
  },
};

const getColorClass = (calendar: string, view: 'month' | 'timeline') => {
  return calendarColorConfig[calendar]?.[view] || calendarColorConfig.default[view];
};


export function Event({ event, onClick, onDelete }: { event: TCalendarEvent, onClick?: (event: TCalendarEvent) => void; onDelete?: (event: TCalendarEvent) => void; }) {
  const colorClass = getColorClass(event.calendar, 'month');
  return (
    <div
      onClick={(e) => {
        if (e.shiftKey && onDelete) {
          e.stopPropagation();
          onDelete(event);
        } else {
          onClick?.(event);
        }
      }}
      onContextMenu={(e) => {
        if (onDelete) {
          e.preventDefault();
          onDelete(event);
        }
      }}
      className={cn("rounded-md border p-1.5 text-xs font-medium leading-tight cursor-pointer hover:brightness-95", colorClass)}
      title="Click to view, Shift+Click or Right-click to delete"
    >
      <p className="truncate">{event.title}</p>
    </div>
  );
}

type TimelineEventProps = {
  event: TCalendarEvent & { slotIndex?: number; slotCount?: number };
  onClick?: (event: TCalendarEvent) => void;
  onDelete?: (event: TCalendarEvent) => void;
};

export function TimelineEvent({ event, onClick, onDelete }: TimelineEventProps) {
  const HALF_HOUR_HEIGHT = 24; // 30min = 24px

  const startMinutes = differenceInMinutes(event.start, startOfDay(event.start));
  const endMinutes = differenceInMinutes(event.end, startOfDay(event.end));

  const top = (startMinutes / 30) * HALF_HOUR_HEIGHT;
  const height = Math.max(((endMinutes - startMinutes) / 30) * HALF_HOUR_HEIGHT, HALF_HOUR_HEIGHT); // Min height of 30min

  // Collision layout
  const slotIndex = event.slotIndex ?? 0;
  const slotCount = event.slotCount ?? 1;
  const width = 100 / slotCount;
  const left = width * slotIndex;
  
  const colorClass = getColorClass(event.calendar, 'timeline');

  return (
    <div
      className={cn(
        "absolute rounded-md p-1 text-xs shadow-md overflow-hidden border cursor-pointer",
        "transition-all duration-150",
        "hover:brightness-90 focus:ring-2 focus:ring-offset-1 focus:ring-black",
        colorClass
      )}
      style={{ top, height, left: `${left}%`, width: `${width}%` }}
      tabIndex={0}
      onClick={(e) => {
        if (e.shiftKey && onDelete) {
          e.stopPropagation();
          onDelete(event);
        } else {
          onClick?.(event);
        }
      }}
      onContextMenu={(e) => {
        if (onDelete) {
          e.preventDefault();
          onDelete(event);
        }
      }}
      title="Click to view, Shift+Click or Right-click to delete"
    >
      <p className="font-medium truncate">{event.title}</p>
       <div className="text-[10px] opacity-80">
        {event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} -{" "}
        {event.end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
      </div>
    </div>
  );
}
