
"use client";

import * as React from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  startOfToday,
  startOfWeek,
  sub,
  startOfMonth,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Event, TimelineEvent } from "@/components/calendar-event";
import { useCalendar } from "@/hooks/use-calendar";
import { SidebarTrigger } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

const viewIntervals = {
  month: {
    start: (d: Date) => startOfWeek(startOfMonth(d)),
    end: (d: Date) => endOfWeek(endOfMonth(d)),
  },
  workWeek: {
    start: (d: Date) => {
      const start = startOfWeek(d, { weekStartsOn: 1 });
      return start;
    },
    end: (d: Date) => {
      const end = endOfWeek(d, { weekStartsOn: 1 });
      return sub(end, { days: 2 });
    },
  },
  week: {
    start: startOfWeek,
    end: endOfWeek,
  },
  day: {
    start: (d: Date) => d,
    end: (d: Date) => d,
  },
};

const viewHeaders = {
  month: (d: Date) => format(d, "MMMM yyyy"),
  workWeek: (d: Date) =>
    `Week of ${format(startOfWeek(d, { weekStartsOn: 1 }), "MMM d")}`,
  week: (d: Date) => `Week of ${format(startOfWeek(d), "MMM d")}`,
  day: (d: Date) => format(d, "MMMM d, yyyy"),
};

export function FamilyCalendar() {
  const {
    events,
    currentDate,
    setCurrentDate,
    view,
    activeCalendars,
    isLoading,
  } = useCalendar();

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 md:hidden" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-48" />
          </div>
        </div>
        <div className="flex-1 overflow-auto mt-4">
            <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  const today = startOfToday();

  const interval = viewIntervals[view];
  let days = eachDayOfInterval({
    start: interval.start(currentDate),
    end: interval.end(currentDate),
  });

  const hours = eachHourOfInterval({
    start: startOfDay(today),
    end: endOfDay(today),
  });

  const getPeriod = () => {
    switch (view) {
      case "month":
        return { months: 1 };
      case "week":
        return { weeks: 1 };
      case "workWeek":
        return { weeks: 1 };
      case "day":
        return { days: 1 };
    }
  };

  function prevPeriod() {
    setCurrentDate(sub(currentDate, getPeriod()));
  }

  function nextPeriod() {
    setCurrentDate(add(currentDate, getPeriod()));
  }

  const filteredEvents = events.filter((event) =>
    activeCalendars.includes(event.calendar)
  );

  const colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
  ];

  const weekDays =
    view === "workWeek"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Button variant="outline" onClick={() => setCurrentDate(today)}>
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={prevPeriod}
            aria-label="Previous period"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextPeriod}
            aria-label="Next period"
          >
            <ChevronRight />
          </Button>
          <h2 className="ml-2 w-48 text-left text-lg font-semibold">
            {viewHeaders[view](currentDate)}
          </h2>
        </div>
      </div>

      {view === "month" ? (
        <div className="grid flex-1 grid-cols-7 mt-4 text-xs font-semibold leading-6 text-center text-muted-foreground">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] mt-4">
          <div className="w-14"></div>
          <div
            className={`grid ${
              view === "day"
                ? "grid-cols-1"
                : view === "week"
                ? "grid-cols-7"
                : "grid-cols-5"
            } text-center`}
          >
            {days.map((day) => (
              <div key={day.toString()} className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground">
                  {format(day, "E")}
                </span>
                <span
                  className={cn(
                    "text-2xl font-bold mt-1 h-10 w-10 flex items-center justify-center rounded-full",
                    isToday(day) && "bg-primary text-primary-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto rounded-lg border mt-2">
        {view === "month" && (
          <div className="grid grid-cols-7 grid-rows-5 h-full">
            {days.map((day, dayIdx) => (
              <div
                key={day.toString()}
                className={cn(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  "relative border-t border-r p-1.5",
                  !isSameMonth(day, currentDate) &&
                    "text-muted-foreground/50 bg-muted/20"
                )}
              >
                <div className="flex flex-col">
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className={cn(
                      "h-7 w-7 rounded-full text-sm font-medium flex items-center justify-center",
                      isToday(day) && "bg-primary text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </time>
                  <div className="mt-2 flex-1 space-y-1">
                    {filteredEvents
                      .filter((event) => isSameDay(event.start, day))
                      .map((event) => (
                        <Event key={event.id} event={event} />
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {(view === "day" || view === "week" || view === "workWeek") && (
          <div
            className="grid grid-cols-1 md:grid-cols-[auto_1fr] h-full"
            style={{ gridTemplateRows: "auto 1fr" }}
          >
            {/* Time column */}
            <div className="text-xs text-right text-muted-foreground pr-2 row-start-2">
              {hours.map((hour, index) => (
                <div
                  key={hour.toString()}
                  className={cn("h-12 flex items-start justify-end -mt-2.5", index > 0 && "border-t")}
                >
                  { index > 0 && <span className="relative top-0">{format(hour, "ha")}</span>}
                </div>
              ))}
            </div>

            {/* Day columns */}
            <div
              className={`grid ${
                view === "day"
                  ? "grid-cols-1"
                  : view === "week"
                  ? "grid-cols-7"
                  : "grid-cols-5"
              } relative row-start-2`}
            >
              {/* Horizontal lines */}
              <div className="col-span-full grid grid-rows-24 absolute inset-0 pointer-events-none">
                {hours.map((_, index) => (
                  <div key={index} className="border-t border-muted"></div>
                ))}
              </div>

              {days.map((day, dayIndex) => (
                <div
                  key={day.toString()}
                  className={cn(
                    "relative",
                    dayIndex > 0 && "border-l border-muted",
                    isToday(day) && 'bg-accent/50'
                  )}
                >
                  {filteredEvents
                    .filter((event) => isSameDay(event.start, day))
                    .map((event) => (
                      <TimelineEvent key={event.id} event={event} />
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
