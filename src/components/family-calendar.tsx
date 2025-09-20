
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

export function FamilyCalendar() {
  const today = startOfToday();
  const [events, setEvents] = React.useState(initialEvents);
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy")
  );
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const [activeCalendars, setActiveCalendars] = React.useState<
    (FamilyMember | "Family")[]
  >(["Family"]);

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function prevMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
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

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft />
          </Button>
          <h2 className="w-40 text-center text-lg font-semibold">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <span>Calendars</span>
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
      </div>
      <div className="grid grid-cols-7 text-xs font-semibold leading-6 text-center text-muted-foreground mt-4">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
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
        className="grid grid-cols-7"
      >
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={cn(
              dayIdx === 0 && colStartClasses[getDay(day)],
              "relative border-t p-1.5",
              !isSameMonth(day, firstDayCurrentMonth) && "text-muted-foreground/50 bg-muted/20"
            )}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "h-7 w-7 rounded-full text-sm",
                    isEqual(day, selectedDay) &&
                      "bg-primary text-primary-foreground",
                    !isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "bg-accent text-accent-foreground",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      "hover:bg-accent"
                  )}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                </button>
              </div>
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
