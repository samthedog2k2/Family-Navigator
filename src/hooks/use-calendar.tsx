
"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { FamilyMember } from '@/lib/types';
import { startOfToday, add } from 'date-fns';

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendar: FamilyMember | "Family";
  color: "blue" | "green" | "purple" | "orange";
};

type CalendarView = "day" | "week" | "month";

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
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState(initialEvents);
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [view, setView] = useState<CalendarView>('week');
  const [activeCalendars, setActiveCalendars] = useState<(FamilyMember | "Family")[]>(["Family"]);

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
  }), [events, currentDate, view, activeCalendars, toggleCalendar]);

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
