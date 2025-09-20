
"use client";

import * as React from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
  sub,
  startOfMonth,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { FamilyMember } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Event, TimelineEvent } from "@/components/calendar-event";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendar: FamilyMember | "Family";
  color: "blue" | "green" | "purple" | "orange";
};

type CalendarView = "day" | "week" | "month";

const familyMembers: (FamilyMember | "Family")[] = [
  "Family",
  "Adam",
  "Holly",
  "Ethan",
  "Elle",
];

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Ethan's Soccer Practice",
    start: add(startOfToday(), { hours: 16 }),
    end: add(startOfToday(), { hours: 17, minutes: 30 }),
    calendar: "Ethan",
    color: "blue",
  },
  {
    id: "2",
    title: "Holly's Book Club",
    start: add(startOfToday(), { hours: 19 }),
    end: add(startOfToday(), { hours: 20, minutes: 30 }),
    calendar: "Holly",
    color: "purple",
  },
  {
    id: "3",
    title: "Adam's Dentist Appointment",
    start: add(startOfToday(), { days: 1, hours: 10 }),
    end: add(startOfToday(), { days: 1, hours: 11 }),
    calendar: "Adam",
    color: "green",
  },
  {
    id: "4",
    title: "Elle's Ballet Recital",
    start: add(startOfToday(), { days: 3, hours: 18 }),
    end: add(startOfToday(), { days: 3, hours: 19 }),
    calendar: "Elle",
    color: "orange",
  },
  {
    id: "5",
    title: "Family Movie Night",
    start: add(startOfToday(), { days: 4, hours: 19 }),
    end: add(startOfToday(), { days: 4, hours: 21 }),
    calendar: "Family",
    color: "blue",
  },
  {
    id: "6",
    title: "Parent-Teacher Conference",
    start: add(startOfToday(), { days: -2, hours: 15 }),
    end: add(startOfToday(), { days: -2, hours: 16 }),
    calendar: "Family",
    color: "purple",
  },
];

const viewIntervals = {
    month: {
        start: (d: Date) => startOfWeek(startOfMonth(d)),
        end: (d: Date) => endOfWeek(endOfMonth(d)),
    },
    week: {
        start: startOfWeek,
        end: endOfWeek,
    },
    day: {
        start: (d: Date) => d,
        end: (d: Date) => d,
    }
}

const viewHeaders = {
    month: (d: Date) => format(d, "MMMM yyyy"),
    week: (d: Date) => `Week of ${format(startOfWeek(d), "MMM d")}`,
    day: (d: Date) => format(d, "MMMM d, yyyy"),
}

export function FamilyCalendar() {
  const today = startOfToday();
  const [events, setEvents] = React.useState(initialEvents);
  const [currentDate, setCurrentDate] = React.useState(today);
  const [view, setView] = React.useState<CalendarView>('week');

  const [activeCalendars, setActiveCalendars] = React.useState<
    (FamilyMember | "Family")[]
  >(["Family", "Adam", "Holly", "Ethan", "Elle"]);

  const interval = viewIntervals[view];
  const days = eachDayOfInterval({
    start: interval.start(currentDate),
    end: interval.end(currentDate)
  });
  
  const hours = eachHourOfInterval({
    start: startOfDay(today),
    end: endOfDay(today),
  });

  const getPeriod = () => {
    switch (view) {
        case 'month': return { months: 1 };
        case 'week': return { weeks: 1 };
        case 'day': return { days: 1 };
    }
  }

  function prevPeriod() {
    setCurrentDate(sub(currentDate, getPeriod()));
  }

  function nextPeriod() {
    setCurrentDate(add(currentDate, getPeriod()));
  }

  const filteredEvents = events.filter((event) =>
    activeCalendars.includes(event.calendar)
  );

  const toggleCalendar = (calendar: FamilyMember | "Family") => {
    setActiveCalendars((prev) =>
      prev.includes(calendar)
        ? prev.filter((c) => c !== calendar)
        : [...prev, calendar]
    );
  };

  const colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setCurrentDate(today)}>Today</Button>
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

        <div className="hidden md:flex items-center gap-2 rounded-md bg-muted p-1">
            {(['day', 'week', 'month'] as CalendarView[]).map(v => (
                <Button key={v} variant={view === v ? 'secondary' : 'ghost'} size="sm" onClick={() => setView(v)}
                 className={cn(view === v && "shadow-sm", "px-3")}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
            ))}
        </div>

        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <span>Select Calendar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <div className="font-semibold">Show Calendars</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {familyMembers.map((calendar) => (
                  <DropdownMenuItem
                    key={calendar}
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => toggleCalendar(calendar)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !activeCalendars.includes(calendar) && "opacity-0"
                      )}
                    />
                    <span>{calendar}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className="h-4 w-4"/>
              <span>Add event</span>
            </Button>
        </div>
      </div>
      
      {view === 'month' ? (
         <div className="grid grid-cols-7 mt-4 text-xs font-semibold leading-6 text-center text-muted-foreground">
            {weekDays.map(day => <div key={day}>{day}</div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] mt-4">
            <div></div>
            <div className={`grid grid-cols-${days.length} text-center`}>
                {days.map((day) => (
                    <div key={day.toString()} className="flex flex-col items-center">
                        <span className="text-sm text-muted-foreground">{format(day, 'E')}</span>
                         <span className={cn("text-2xl font-bold mt-1 h-10 w-10 flex items-center justify-center rounded-full", isToday(day) && "bg-primary text-primary-foreground")}>{format(day, 'd')}</span>
                    </div>
                ))}
            </div>
        </div>
      )}


      <div className="flex-1 overflow-auto">
        {view === 'month' && (
             <div className="grid grid-cols-7 grid-rows-5 h-full">
                {days.map((day, dayIdx) => (
                <div
                    key={day.toString()}
                    className={cn(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    "relative border-t border-r p-1.5",
                    !isSameMonth(day, currentDate) && "text-muted-foreground/50 bg-muted/20"
                    )}
                >
                    <div className="flex flex-col">
                        <time dateTime={format(day, "yyyy-MM-dd")} className={cn(
                                "h-7 w-7 rounded-full text-sm font-medium flex items-center justify-center",
                                isToday(day) && "bg-primary text-primary-foreground",
                            )}>
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
        {(view === 'day' || view === 'week') && (
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] h-full">
                {/* Time column */}
                <div className="text-xs text-right text-muted-foreground pr-2">
                    {hours.map(hour => (
                        <div key={hour.toString()} className="h-12 flex items-start justify-end -mt-2">
                             <span className="relative top-2">{format(hour, 'ha')}</span>
                        </div>
                    ))}
                </div>

                {/* Day columns */}
                <div className={`grid grid-cols-${days.length} relative`}>
                    {/* Horizontal lines */}
                     <div className="col-span-full grid grid-rows-24 absolute inset-0">
                        {hours.map((_, index) => (
                            <div key={index} className="border-t border-muted"></div>
                        ))}
                    </div>

                    {days.map((day, dayIndex) => (
                        <div key={day.toString()} className={cn("relative", dayIndex > 0 && "border-l")}>
                             {filteredEvents.filter(event => isSameDay(event.start, day))
                                .map(event => (
                                    <TimelineEvent key={event.id} event={event}/>
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

    