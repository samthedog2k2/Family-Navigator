
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
  differenceInMinutes,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Event, TimelineEvent } from "@/components/calendar-event";
import { useCalendar } from "@/hooks/use-calendar";
import { Skeleton } from "./ui/skeleton";
import type { CalendarEvent as TCalendarEvent } from "@/hooks/use-calendar";

const viewIntervals = {
  month: {
    start: (d: Date) => startOfWeek(startOfMonth(d)),
    end: (d: Date) => endOfWeek(endOfMonth(d)),
  },
  workWeek: {
    start: (d: Date) => startOfWeek(d, { weekStartsOn: 1 }),
    end: (d: Date) => endOfWeek(d, { weekStartsOn: 1 }),
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

function NowLine() {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const HOUR_HEIGHT = 48; // h-12
  const minutesSinceStart = differenceInMinutes(now, startOfDay(now));
  const top = (minutesSinceStart / 60) * HOUR_HEIGHT;

  return (
    <div
      className="absolute left-0 right-0 h-[2px] bg-red-500 z-20"
      style={{ top: `${top}px` }}
    />
  );
}

function groupOverlappingEvents(events: TCalendarEvent[]) {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  if (sorted.length === 0) return [];
  
  const clusters: { items: typeof sorted; }[] = [];
  let currentCluster: typeof sorted = [];

  for (const ev of sorted) {
    if (
      currentCluster.length === 0 ||
      ev.start < currentCluster[currentCluster.length - 1].end
    ) {
      currentCluster.push(ev);
    } else {
      clusters.push({ items: currentCluster });
      currentCluster = [ev];
    }
  }
  if (currentCluster.length) clusters.push({ items: currentCluster });

  // assign slotIndex + slotCount
  return clusters.flatMap((cluster) => {
    const count = cluster.items.length;
    return cluster.items.map((ev, i) => ({
      ...ev,
      slotIndex: i,
      slotCount: count,
    }));
  });
}


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
  
  let days = eachDayOfInterval({
    start: viewIntervals[view].start(currentDate),
    end: viewIntervals[view].end(currentDate),
  });

  if (view === "workWeek") {
    days = days.slice(0, 5); // Mon-Fri
  }

  const hours = eachHourOfInterval({
    start: startOfDay(today),
    end: endOfDay(today),
  });

  const getPeriod = () => {
    switch (view) {
      case "month":
        return { months: 1 };
      case "week":
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
    "", "col-start-2", "col-start-3", "col-start-4", "col-start-5", "col-start-6", "col-start-7",
  ];

  const weekDays =
    view === "workWeek"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCurrentDate(today)}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={prevPeriod} aria-label="Previous period">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={nextPeriod} aria-label="Next period">
            <ChevronRight />
          </Button>
          <h2 className="ml-2 w-48 text-left text-lg font-semibold">
            {viewHeaders[view](currentDate)}
          </h2>
        </div>
      </div>

      <div className="flex-1 mt-4 flex flex-col overflow-auto rounded-lg border">
        {view === "month" ? (
          <>
            <div className="grid flex-1 grid-cols-7 text-xs font-semibold leading-6 text-center text-muted-foreground">
              {weekDays.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 h-full divide-x divide-border">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={cn(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    "relative border-t border-border p-1.5",
                    !isSameMonth(day, currentDate) && "text-muted-foreground/50 bg-muted/20"
                  )}
                >
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
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="sticky top-0 z-20 bg-background border-b border-border">
              <div className="grid grid-cols-[auto_1fr]">
                <div className="w-14"></div>
                <div
                  className={`grid ${
                    view === 'day' ? 'grid-cols-1' : view === 'week' ? 'grid-cols-7' : 'grid-cols-5'
                  } divide-x divide-border text-center`}
                >
                  {days.map((day) => (
                    <div key={day.toString()} className="flex flex-col items-center py-2">
                      <span className="text-sm text-muted-foreground">{format(day, "E")}</span>
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
            </div>

            <div className="flex-1 grid grid-cols-[auto_1fr] overflow-auto">
              <div className="sticky left-0 z-10 w-14 text-xs text-right text-muted-foreground pr-2 bg-background">
                {hours.map((hour, index) => (
                  <div key={hour.toString()} className="h-12 flex justify-end items-start">
                    {index > 0 && <span className="relative -top-2.5">{format(hour, "ha")}</span>}
                  </div>
                ))}
              </div>

              <div className="relative grid flex-1">
                 <div className="grid grid-rows-48 pointer-events-none">
                  {Array.from({ length: 48 }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "border-t",
                        index % 2 === 0
                          ? "border-border"
                          : "border-border/50"
                      )}
                    ></div>
                  ))}
                </div>

                <NowLine />

                <div
                  className={`grid ${
                    view === 'day' ? 'grid-cols-1' : view === 'week' ? 'grid-cols-7' : 'grid-cols-5'
                  } divide-x divide-border absolute inset-0`}
                >
                  {days.map((day) => {
                    const dayEvents = filteredEvents.filter((event) => isSameDay(event.start, day));
                    const laidOutEvents = groupOverlappingEvents(dayEvents);
                    return(
                      <div
                        key={day.toString()}
                        className={cn("relative", isToday(day) && 'bg-accent/50')}
                      >
                        {laidOutEvents.map((event) => (
                            <TimelineEvent key={event.id} event={event} />
                          ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
