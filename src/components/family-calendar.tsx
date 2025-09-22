
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
  setHours,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, GanttChartSquare, View, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Event, TimelineEvent } from "@/components/calendar-event";
import { useCalendar } from "@/hooks/use-calendar";
import { Skeleton } from "./ui/skeleton";
import type { CalendarEvent as TCalendarEvent } from "@/hooks/use-calendar";
import { NewEventDialog } from "./new-event-dialog";
import { EventDetailDialog } from "./event-detail-dialog";
import { getHoliday } from "@/lib/holidays";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const calendarColors: { [key: string]: { background: string; darkBackground: string; border: string; } } = {
  Adam:   { background: 'bg-blue-100',   darkBackground: 'dark:bg-blue-900/40',   border: 'border-blue-500' },
  Holly:  { background: 'bg-pink-100',   darkBackground: 'dark:bg-pink-900/40',   border: 'border-pink-500' },
  Ethan:  { background: 'bg-green-100',  darkBackground: 'dark:bg-green-900/40',  border: 'border-green-500' },
  Elle:   { background: 'bg-purple-100', darkBackground: 'dark:bg-purple-900/40', border: 'border-purple-500' },
  default: { background: 'bg-gray-100', darkBackground: 'dark:bg-gray-900/40', border: 'border-gray-500' },
};
export const getCalendarColor = (calendar: string) => calendarColors[calendar] || calendarColors.default;


const viewIntervals = {
  month: { start: (d: Date) => startOfWeek(startOfMonth(d)), end: (d: Date) => endOfWeek(endOfMonth(d)) },
  workWeek: { start: (d: Date) => startOfWeek(d, { weekStartsOn: 1 }), end: (d: Date) => endOfWeek(d, { weekStartsOn: 1 }) },
  week: { start: startOfWeek, end: endOfWeek },
  day: { start: (d: Date) => d, end: (d: Date) => d },
};

const viewHeaders = {
  month: (d: Date) => format(d, "MMMM yyyy"),
  workWeek: (d: Date) => `Week of ${format(startOfWeek(d, { weekStartsOn: 1 }), "MMM d")}`,
  week: (d: Date) => `Week of ${format(startOfWeek(d), "MMM d")}`,
  day: (d: Date) => format(d, "MMMM d, yyyy"),
};

type CalendarView = "day" | "workWeek" | "week" | "month";

function NowLine() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  const minutesSinceStart = differenceInMinutes(now, startOfDay(now));
  const top = (minutesSinceStart / 30) * 24; // 30min = 24px

  return (
    <>
      <div className="absolute left-0 right-0 h-[2px] bg-red-500 z-20" style={{ top }} />
      <div className="absolute -left-1 w-2 h-2 rounded-full bg-red-500 z-20" style={{ top: top - 3 }}/>
    </>
  );
}

function groupOverlappingEvents(events: TCalendarEvent[]) {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  if (sorted.length === 0) return [];

  const clusters: { items: typeof sorted }[] = [];
  let currentCluster: typeof sorted = [];

  for (const ev of sorted) {
    const lastInCluster = currentCluster.reduce((latest, current) => !latest || current.end > latest.end ? current : latest, null as TCalendarEvent | null);
    if (currentCluster.length === 0 || (lastInCluster && ev.start < lastInCluster.end)) {
      currentCluster.push(ev);
    } else {
      clusters.push({ items: currentCluster });
      currentCluster = [ev];
    }
  }
  if (currentCluster.length) clusters.push({ items: currentCluster });

  return clusters.flatMap(cluster => {
    const sortedClusterItems = cluster.items.sort((a, b) => a.start.getTime() - b.start.getTime());
    const slotCount = sortedClusterItems.length;
    return sortedClusterItems.map((event, index) => ({ ...event, slotIndex: index, slotCount: slotCount }));
  });
}

export function FamilyCalendar() {
  const { events, currentDate, setCurrentDate, view, setView, activeCalendars, calendars, toggleCalendar, isLoading } = useCalendar();
  const [selectedEvent, setSelectedEvent] = React.useState<TCalendarEvent | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (view === 'month' || !scrollRef.current) return;
    
    // In timeline views, scroll to 8am or current time
    let scrollToHour = 8;
    if (isToday(currentDate)) {
        scrollToHour = new Date().getHours();
    }
    const scrollPosition = Math.max((scrollToHour - 1) * 2 * 24, 0); // (hour - 1) * 2 slots/hr * 24px/slot
    
    scrollRef.current.scrollTo({ top: scrollPosition, behavior: 'smooth' });

}, [view, currentDate, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col"><Skeleton className="h-[68px] w-full mb-4" /><div className="flex-1 overflow-auto"><Skeleton className="h-full w-full" /></div></div>
    );
  }

  const today = startOfToday();
  let days = eachDayOfInterval({ start: viewIntervals[view].start(currentDate), end: viewIntervals[view].end(currentDate) });
  if (view === "workWeek") days = days.slice(0, 5); // Mon-Fri

  const dayHours = eachHourOfInterval({ start: startOfDay(today), end: endOfDay(today) });
  const getPeriod = () => ({ weeks: view.includes("Week") ? 1 : 0, days: view === "day" ? 1 : 0, months: view === "month" ? 1 : 0 });

  const filteredEvents = events.filter((event) => activeCalendars.includes(event.calendar));
  const colStartClasses = ["", "col-start-2", "col-start-3", "col-start-4", "col-start-5", "col-start-6", "col-start-7"];
  const weekDays = view === "workWeek" ? ["Mon", "Tue", "Wed", "Thu", "Fri"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1 border-b">
        <div className="flex items-center gap-2 w-full">
            <NewEventDialog defaultDate={currentDate} />
            <Button variant="outline" onClick={() => setCurrentDate(today)}>Today</Button>
             <div className="flex items-center rounded-md border">
                <Button variant="ghost" size="icon" className="border-r rounded-none" onClick={() => setCurrentDate(sub(currentDate, getPeriod()))} aria-label="Previous period"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="rounded-none" onClick={() => setCurrentDate(add(currentDate, getPeriod()))} aria-label="Next period"><ChevronRight className="h-4 w-4" /></Button>
            </div>
             <h2 className="ml-2 w-48 text-left text-lg font-semibold">{viewHeaders[view](currentDate)}</h2>
        </div>
        <div className="flex items-center gap-2 w-full justify-end">
            <Popover>
                <PopoverTrigger asChild><Button variant="outline"><Users className="mr-2 h-4 w-4" /> Calendars</Button></PopoverTrigger>
                <PopoverContent className="w-56 p-2">
                    <div className="grid gap-2">
                        <Label className="px-2 py-1.5 text-sm font-semibold">Show Calendars</Label>
                        {calendars.map(cal => {
                            const color = getCalendarColor(cal);
                            return (
                                <div key={cal} className="flex items-center space-x-2 rounded-md hover:bg-muted/50 p-2">
                                    <Checkbox id={cal} checked={activeCalendars.includes(cal)} onCheckedChange={() => toggleCalendar(cal)} className={cn(color.background, color.border, "data-[state=checked]:text-white")}/>
                                    <Label htmlFor={cal} className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{cal}</Label>
                                </div>
                            )
                        })}
                    </div>
                </PopoverContent>
            </Popover>
            <ToggleGroup type="single" value={view} onValueChange={(v) => { if(v) setView(v as CalendarView)}} className="border rounded-md">
                <ToggleGroupItem value="day" aria-label="Day view"><View className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="workWeek" aria-label="Work week view"><GanttChartSquare className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="month" aria-label="Month view"><CalendarIcon className="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
        </div>
      </header>

      <div className="flex-1 mt-4 flex flex-col overflow-auto rounded-lg border">
        {view === "month" ? (
          <>
            <div className="grid flex-1 grid-cols-7 text-xs font-semibold leading-6 text-center text-muted-foreground">
              {weekDays.map((day) => (<div key={day}>{day}</div>))}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 h-full divide-x divide-border">
              {days.map((day, dayIdx) => {
                const holiday = getHoliday(day);
                return (
                  <div key={day.toString()} className={cn("relative border-t border-border p-1 pl-1.5", dayIdx === 0 && colStartClasses[getDay(day)], holiday && "bg-sky-50 dark:bg-sky-900/20 border-l-4 border-l-sky-400", !isSameMonth(day, currentDate) && "text-muted-foreground/50 bg-muted/20")}>
                    <time dateTime={format(day, "yyyy-MM-dd")} className={cn("h-7 w-7 rounded-full text-sm font-medium flex items-center justify-center", isToday(day) && "bg-primary text-primary-foreground")}>{format(day, "d")}</time>
                    {holiday && <div className="text-[10px] text-sky-600 dark:text-sky-300 font-semibold mt-0.5">{holiday}</div>}
                    <div className="mt-2 flex-1 space-y-1">
                      {filteredEvents.filter((event) => isSameDay(event.start, day)).map((event) => (<Event key={event.id} event={event} onClick={setSelectedEvent} />))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="sticky top-0 z-30 bg-background border-b border-border">
              <div className="grid grid-cols-[auto_1fr]">
                <div className="w-14"></div>
                <div className={`grid ${view === 'day' ? 'grid-cols-1' : view === 'week' ? 'grid-cols-7' : 'grid-cols-5'} divide-x divide-border text-center`}>
                  {days.map((day) => {
                    const holiday = getHoliday(day);
                    return(
                    <div key={day.toString()} className={cn("py-2 flex flex-col items-center", holiday && "bg-sky-50 dark:bg-sky-900/20")}>
                       <span className="text-sm text-muted-foreground">{format(day, "E")}</span>
                      <span className={cn("text-2xl font-bold mt-1 h-10 w-10 flex items-center justify-center rounded-full", isToday(day) && "bg-primary text-primary-foreground")}>{format(day, "d")}</span>
                      {holiday && <span className="text-xs text-sky-600 font-semibold truncate px-1">{holiday}</span>}
                    </div>
                  )})}
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 grid grid-cols-[auto_1fr] overflow-auto">
              <div className="sticky left-0 z-20 w-14 text-xs text-right text-muted-foreground pr-2 bg-background">
                {dayHours.map((hour, index) => (<div key={hour.toString()} className="h-24 flex justify-end items-start -mt-2.5">{index > 0 ? <span>{format(hour, "ha")}</span> : null}</div>))}
              </div>
              <div className="relative grid flex-1">
                 <div className="absolute inset-0 grid grid-rows-[repeat(48,minmax(0,1fr))] pointer-events-none" >
                  {Array.from({ length: 48 }).map((_, index) => (<div key={index} className={cn("border-t", index % 2 === 0 ? "border-border" : "border-border/50")}></div>))}
                </div>
                {isToday(currentDate) && <NowLine />}
                <div className={`grid ${view === 'day' ? 'grid-cols-1' : view === 'week' ? 'grid-cols-7' : 'grid-cols-5'} divide-x divide-border absolute inset-0`}>
                  {days.map((day) => {
                    const dayEvents = filteredEvents.filter((event) => isSameDay(event.start, day));
                    const laidOutEvents = groupOverlappingEvents(dayEvents);
                    return(
                      <div key={day.toString()} className={cn("relative", isToday(day) && 'bg-accent/20')}>
                        {laidOutEvents.map((event) => (<TimelineEvent key={event.id} event={event} onClick={setSelectedEvent}/>))}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
       <EventDetailDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
