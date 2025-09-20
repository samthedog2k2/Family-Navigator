
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
} from "date-fns";
import { Resizable } from "re-resizable";
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
import { Event } from "@/components/calendar-event";

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

const viewGridCols = {
    month: 'grid-cols-7',
    week: 'grid-cols-7',
    day: 'grid-cols-1'
}

export function FamilyCalendar() {
  const today = startOfToday();
  const [events, setEvents] = React.useState(initialEvents);
  const [currentDate, setCurrentDate] = React.useState(today);
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [view, setView] = React.useState<CalendarView>('week');

  const [activeCalendars, setActiveCalendars] = React.useState<
    (FamilyMember | "Family")[]
  >(["Family"]);


  const interval = viewIntervals[view];
  const days = eachDayOfInterval({
    start: interval.start(currentDate),
    end: interval.end(currentDate)
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
          <Button variant="outline" size="icon" onClick={prevPeriod}>
            <ChevronLeft />
          </Button>
          <h2 className="w-48 text-center text-lg font-semibold">
             {viewHeaders[view](currentDate)}
          </h2>
          <Button variant="outline" size="icon" onClick={nextPeriod}>
            <ChevronRight />
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-md bg-muted p-1">
            {(['day', 'week', 'month'] as CalendarView[]).map(v => (
                <Button key={v} variant={view === v ? 'default' : 'ghost'} size="sm" onClick={() => setView(v)}
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
                        "mr-2",
                        !activeCalendars.includes(calendar) && "opacity-0"
                      )}
                    />
                    <span>{calendar}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus />
              <span>Add event</span>
            </Button>
        </div>
      </div>
      <div className={cn("grid text-xs font-semibold leading-6 text-center text-muted-foreground mt-4", viewGridCols[view])}>
        { (view === 'week' || view === 'month') && weekDays.map(day => <div key={day}>{day}</div>) }
        { view === 'day' && <div>{weekDays[getDay(currentDate)]}</div> }
      </div>
      <Resizable
        defaultSize={{
          height: "80vh",
          width: "100%",
        }}
        handleClasses={{
          bottom: "w-full h-2 bottom-0",
        }}
        enable={{
          bottom: true,
        }}
        className={cn("grid", viewGridCols[view])}
      >
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={cn(
              (view === 'month' && dayIdx === 0) && colStartClasses[getDay(day)],
              "relative border-t p-1.5",
              view === 'month' && !isSameMonth(day, currentDate) && "text-muted-foreground/50 bg-muted/20"
            )}
          >
            <div className="flex flex-col">
                <button
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "h-7 w-7 rounded-full text-sm font-medium",
                     isEqual(day, selectedDay) && "bg-primary text-primary-foreground",
                     !isEqual(day, selectedDay) && isToday(day) && "bg-accent text-accent-foreground",
                     !isEqual(day, selectedDay) && !isToday(day) && "hover:bg-accent"
                  )}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                </button>
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
      </Resizable>
    </div>
  );
}
