
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
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Event, TimelineEvent } from "@/components/calendar-event";
import { useCalendar } from "@/hooks/use-calendar";
import { Skeleton } from "./ui/skeleton";
import type { CalendarEvent as TCalendarEvent } from "@/hooks/use-calendar";
import { NewEventDialog } from "./new-event-dialog";
import { EventDetailDialog } from "./event-detail-dialog";
import { getHoliday, getHolidayInfo } from "@/lib/holidays";
import { getDayInfo } from "@/lib/astronomy";
import { getMoonPhaseIcon, getSunriseIcon, getSunsetIcon, getHolidayIcon, getMoonPhaseDescription } from "@/lib/calendar-icons";
import { CalendarSidebar } from "./calendar-sidebar";
import { ClickEventDialog } from "./click-event-dialog";

const calendarColors: { [key: string]: { background: string; darkBackground: string; border: string; color: string; lightBg: string; } } = {
  Adam:   { background: 'bg-[#0078d4]/20',   darkBackground: 'dark:bg-[#0078d4]/40',   border: 'border-[#0078d4]', color: '#0078d4', lightBg: 'bg-[#0078d4]/10' },
  Holly:  { background: 'bg-[#8764b8]/20',   darkBackground: 'dark:bg-[#8764b8]/40',   border: 'border-[#8764b8]', color: '#8764b8', lightBg: 'bg-[#8764b8]/10' },
  Ethan:  { background: 'bg-[#107c10]/20',  darkBackground: 'dark:bg-[#107c10]/40',  border: 'border-[#107c10]', color: '#107c10', lightBg: 'bg-[#107c10]/10' },
  Elle:   { background: 'bg-[#e3008c]/20', darkBackground: 'dark:bg-[#e3008c]/40', border: 'border-[#e3008c]', color: '#e3008c', lightBg: 'bg-[#e3008c]/10' },
  Family: { background: 'bg-[#605e5c]/20', darkBackground: 'dark:bg-[#605e5c]/40', border: 'border-[#605e5c]', color: '#605e5c', lightBg: 'bg-[#605e5c]/10' },
  default: { background: 'bg-transparent', darkBackground: 'bg-transparent', border: 'border-gray-500', color: '#6b7280', lightBg: 'bg-transparent' },
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
      {/* Main time line */}
      <div
        className="absolute left-0 right-0 h-[2px] bg-red-500 z-30 shadow-sm"
        style={{ top }}
      />
      {/* Time indicator circle */}
      <div
        className="absolute -left-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white z-30 shadow-md"
        style={{ top: top - 6 }}
      />
      {/* Time label */}
      <div
        className="absolute -left-12 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium z-30"
        style={{ top: top - 10 }}
      >
        {format(now, 'h:mm a')}
      </div>
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
  const { events, setEvents, currentDate, setCurrentDate, view, setView, activeCalendars, calendars, toggleCalendar, isLoading, showWorkHours, businessHoursStart, businessHoursEnd } = useCalendar();
  const [selectedEvent, setSelectedEvent] = React.useState<TCalendarEvent | null>(null);
  const [clickEventDialog, setClickEventDialog] = React.useState<{ isOpen: boolean; date: Date; time?: string }>({ isOpen: false, date: new Date() });

  const handleDeleteEvent = (eventToDelete: TCalendarEvent) => {
    setEvents((prev) => prev.filter(event => event.id !== eventToDelete.id));
  };
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

  const allDayHours = eachHourOfInterval({ start: startOfDay(today), end: endOfDay(today) });
  const dayHours = showWorkHours && view !== 'month'
    ? allDayHours.filter((hour) => {
        const hourNum = hour.getHours();
        return hourNum >= businessHoursStart && hourNum <= businessHoursEnd;
      })
    : allDayHours;
  const getPeriod = () => ({ weeks: view.includes("Week") ? 1 : 0, days: view === "day" ? 1 : 0, months: view === "month" ? 1 : 0 });

  const filteredEvents = events.filter((event) => activeCalendars.includes(event.calendar));
  const colStartClasses = ["", "col-start-2", "col-start-3", "col-start-4", "col-start-5", "col-start-6", "col-start-7"];
  const weekDays = view === "workWeek" ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="flex h-full">
      <CalendarSidebar />
      <div className="flex h-full flex-col flex-1">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1 border-b">
        <div className="flex items-center gap-2 w-full">
            <NewEventDialog
              defaultDate={currentDate}
              defaultCalendar={activeCalendars.length === 1 ? activeCalendars[0] : "Family"}
            />
            <Button variant="outline" onClick={() => setCurrentDate(today)}>Today</Button>
             <div className="flex items-center rounded-md border">
                <Button variant="ghost" size="icon" className="border-r rounded-none" onClick={() => setCurrentDate(sub(currentDate, getPeriod()))} aria-label="Previous period"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="rounded-none" onClick={() => setCurrentDate(add(currentDate, getPeriod()))} aria-label="Next period"><ChevronRight className="h-4 w-4" /></Button>
            </div>
             <h2 className="ml-2 w-48 text-left text-lg font-semibold">{viewHeaders[view](currentDate)}</h2>
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
                const holiday = getHolidayInfo(day);
                const dayInfo = getDayInfo(day);
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "relative border-t border-border p-1 pl-1.5 cursor-pointer hover:bg-accent/20 transition-colors",
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      holiday && "bg-sky-50 dark:bg-sky-900/20 border-l-4 border-l-sky-400",
                      !isSameMonth(day, currentDate) && "text-muted-foreground/50 bg-muted/20"
                    )}
                    onClick={() => setClickEventDialog({ isOpen: true, date: day })}
                  >
                    <div className="flex items-start justify-between">
                      <time dateTime={format(day, "yyyy-MM-dd")} className={cn("h-7 w-7 rounded-full text-sm font-medium flex items-center justify-center", isToday(day) && "bg-primary text-primary-foreground")}>{format(day, "d")}</time>
                      <div className="flex flex-col items-end text-[10px] text-muted-foreground gap-0.5">
                        <div title={getMoonPhaseDescription(dayInfo.moonPhase)}>
                          {getMoonPhaseIcon(dayInfo.moonPhase, 10)}
                        </div>
                        {holiday && (
                          <div>
                            {getHolidayIcon(holiday.name, 10)}
                          </div>
                        )}
                      </div>
                    </div>
                    {holiday && <div className="text-[10px] text-sky-600 dark:text-sky-300 font-semibold mt-0.5 truncate">{holiday.name}</div>}
                    {dayInfo.sunrise && dayInfo.sunset && (
                      <div className="text-[9px] text-muted-foreground mt-0.5 space-y-0.5">
                        <div className="flex items-center gap-1">
                          {getSunriseIcon(8)}
                          <span>{dayInfo.sunrise}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getSunsetIcon(8)}
                          <span>{dayInfo.sunset}</span>
                        </div>
                      </div>
                    )}
                    <div className="mt-2 flex-1 space-y-1">
                      {filteredEvents.filter((event) => isSameDay(event.start, day)).map((event) => (<Event key={event.id} event={event} onClick={setSelectedEvent} onDelete={handleDeleteEvent} />))}
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
                    const holiday = getHolidayInfo(day);
                    const dayInfo = getDayInfo(day);
                    return(
                    <div key={day.toString()} className={cn(
                      "py-2 flex flex-col items-center min-h-[120px]",
                      holiday && "bg-sky-50 dark:bg-sky-900/20",
                      isToday(day) && "bg-blue-50/60 dark:bg-blue-900/15"
                    )}>
                       <span className="text-sm text-muted-foreground">{format(day, "EEEE")}</span>
                      <span className={cn("text-2xl font-bold mt-1 h-10 w-10 flex items-center justify-center rounded-full", isToday(day) && "bg-primary text-primary-foreground")}>{format(day, "d")}</span>

                      {/* Holiday */}
                      {holiday && (
                        <div className="text-xs font-semibold truncate px-1 flex items-center gap-1 mt-1">
                          {getHolidayIcon(holiday.name, 12)}
                          <span className="truncate text-sky-600 dark:text-sky-300">{holiday.name}</span>
                        </div>
                      )}

                      {/* Moon Phase */}
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1" title={getMoonPhaseDescription(dayInfo.moonPhase)}>
                        {getMoonPhaseIcon(dayInfo.moonPhase, 12)}
                        <span className="text-[10px]">{dayInfo.moonPhase.split(' ')[0]}</span>
                      </div>

                      {/* Sunrise/Sunset */}
                      {dayInfo.sunrise && dayInfo.sunset && (
                        <div className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                          <div className="flex items-center gap-1">
                            {getSunriseIcon(10)}
                            <span>{dayInfo.sunrise}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getSunsetIcon(10)}
                            <span>{dayInfo.sunset}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 grid grid-cols-[auto_1fr] overflow-auto">
              <div className="sticky left-0 z-20 w-14 text-xs text-right text-muted-foreground pr-2 bg-background">
                {dayHours.map((hour, index) => {
                  const hourNum = hour.getHours();
                  const isBusinessHour = hourNum >= businessHoursStart && hourNum <= businessHoursEnd;
                  return (
                    <div
                      key={hour.toString()}
                      className={cn(
                        "h-24 flex justify-end items-start -mt-2.5",
                        showWorkHours && !isBusinessHour && "opacity-50"
                      )}
                    >
                      {index > 0 ? <span className="text-xs">{format(hour, "h a").toLowerCase()}</span> : null}
                    </div>
                  );
                })}
              </div>
              <div className="relative grid flex-1">
                 <div className="absolute inset-0 grid grid-rows-[repeat(48,minmax(0,1fr))] pointer-events-none" >
                  {Array.from({ length: 48 }).map((_, index) => {
                    const hourIndex = Math.floor(index / 2);
                    const isBusinessHour = hourIndex >= businessHoursStart && hourIndex <= businessHoursEnd;
                    return (
                      <div
                        key={index}
                        className={cn(
                          "border-t",
                          index % 2 === 0 ? "border-border" : "border-border/50",
                          showWorkHours && !isBusinessHour && "bg-muted/20"
                        )}
                      />
                    );
                  })}
                </div>
                {days.some(day => isToday(day)) && <NowLine />}
                <div className={`grid ${view === 'day' ? 'grid-cols-1' : view === 'week' ? 'grid-cols-7' : 'grid-cols-5'} divide-x divide-border absolute inset-0`}>
                  {days.map((day) => {
                    const dayEvents = filteredEvents.filter((event) => isSameDay(event.start, day));
                    const laidOutEvents = groupOverlappingEvents(dayEvents);
                    return(
                      <div
                        key={day.toString()}
                        className={cn(
                          "relative cursor-pointer hover:bg-accent/30 transition-colors",
                          isToday(day) && 'bg-blue-50/60 dark:bg-blue-900/15'
                        )}
                        onClick={(e) => {
                          // Calculate the clicked time based on position
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickY = e.clientY - rect.top;
                          const hourHeight = rect.height / 24; // 24 hours in a day
                          const clickedHour = Math.floor(clickY / hourHeight);
                          const clickedTime = format(new Date(day.getFullYear(), day.getMonth(), day.getDate(), clickedHour, 0), "yyyy-MM-dd'T'HH:mm");
                          setClickEventDialog({ isOpen: true, date: day, time: clickedTime });
                        }}
                      >
                        {laidOutEvents.map((event) => (<TimelineEvent key={event.id} event={event} onClick={setSelectedEvent} onDelete={handleDeleteEvent}/>))}
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
       <ClickEventDialog
         isOpen={clickEventDialog.isOpen}
         onClose={() => setClickEventDialog({ isOpen: false, date: new Date() })}
         date={clickEventDialog.date}
         time={clickEventDialog.time}
         selectedCalendar={activeCalendars.length === 1 ? activeCalendars[0] : "All"}
       />
      </div>
    </div>
  );
}
