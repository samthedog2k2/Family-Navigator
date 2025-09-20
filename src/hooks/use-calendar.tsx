
"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { FamilyMember } from '@/lib/types';
import { startOfToday, add } from 'date-fns';

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendar: FamilyMember | "Family";
  color: "blue" | "green" | "purple" | "orange";
  allDay?: boolean;
};

type CalendarView = "day" | "workWeek" | "week" | "month";

const rawInitialEvents = [
  {
    id: "1",
    title: "Ethan's Soccer Practice",
    start: { add: { hours: 16 } },
    end: { add: { hours: 17, minutes: 30 } },
    calendar: "Ethan",
    color: "blue",
  },
  {
    id: "2",
    title: "Holly's Book Club",
    start: { add: { hours: 19 } },
    end: { add: { hours: 20, minutes: 30 } },
    calendar: "Holly",
    color: "purple",
  },
   {
    id: '2.1',
    title: "Adam's Project Deadline",
    start: { add: { hours: 18, minutes: 30 } },
    end: { add: { hours: 20 } },
    calendar: 'Adam',
    color: 'green',
  },
  {
    id: "3",
    title: "Adam's Dentist Appointment",
    start: { add: { days: 1, hours: 10 } },
    end: { add: { days: 1, hours: 11 } },
    calendar: "Adam",
    color: "green",
  },
  {
    id: "4",
    title: "Elle's Ballet Recital",
    start: { add: { days: 2, hours: 13 } },
    end: { add: { days: 2, hours: 14 } },
    calendar: "Elle",
    color: "orange",
  },
  {
    id: "5",
    title: "Family Movie Night",
    start: { add: { days: 4, hours: 19 } },
    end: { add: { days: 4, hours: 21 } },
    calendar: "Family",
    color: "blue",
  },
  {
    id: "6",
    title: "Parent-Teacher Conference",
    start: { add: { days: -2, hours: 15 } },
    end: { add: { days: -2, hours: 16 } },
    calendar: "Family",
    color: "purple",
  },
];


type CalendarContextType = {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  view: CalendarView;
  setView: React.Dispatch<React.SetStateAction<CalendarView>>;
  activeCalendars: (FamilyMember | "Family")[];
  setActiveCalendars: React.Dispatch<React.SetStateAction<(FamilyMember | "Family")[]>>;
  toggleCalendar: (calendar: FamilyMember | "Family") => void;
  isLoading: boolean;
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('workWeek');
  const [activeCalendars, setActiveCalendars] = useState<(FamilyMember | "Family")[]>(["Family", "Adam", "Holly", "Ethan", "Elle"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = startOfToday();
    setCurrentDate(today);

    const processedEvents = rawInitialEvents.map(event => ({
      ...event,
      start: add(today, event.start.add),
      end: add(today, event.end.add),
    }));
    setEvents(processedEvents as CalendarEvent[]);

    setIsLoading(false);
  }, []);

  const toggleCalendar = useCallback((calendar: FamilyMember | "Family") => {
    setActiveCalendars((prev) =>
      prev.includes(calendar)
        ? prev.filter((c) => c !== calendar)
        : [...prev, calendar]
    );
  }, []);

  const value = useMemo(() => ({
    events,
    setEvents,
    currentDate,
    setCurrentDate,
    view,
    setView,
    activeCalendars,
    setActiveCalendars,
    toggleCalendar,
    isLoading,
  }), [events, currentDate, view, activeCalendars, toggleCalendar, isLoading]);

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
