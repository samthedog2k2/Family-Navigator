
"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { startOfToday, add } from 'date-fns';

export type FamilyMember = "Adam" | "Holly" | "Ethan" | "Elle";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendar: FamilyMember | "Family";
  allDay?: boolean;
};

export type CalendarView = "day" | "workWeek" | "week" | "month";

const rawInitialEvents = [
  {
    id: "1",
    title: "Ethan's Soccer Practice",
    start: { add: { hours: 16 } },
    end: { add: { hours: 17, minutes: 30 } },
    calendar: "Ethan",
  },
  {
    id: "2",
    title: "Holly's Book Club",
    start: { add: { hours: 19 } },
    end: { add: { hours: 20, minutes: 30 } },
    calendar: "Holly",
  },
   {
    id: '2.1',
    title: "Adam's Project Deadline",
    start: { add: { hours: 18, minutes: 30 } },
    end: { add: { hours: 20 } },
    calendar: 'Adam',
  },
  {
    id: "3",
    title: "Adam's Dentist Appointment",
    start: { add: { days: 1, hours: 10 } },
    end: { add: { days: 1, hours: 11 } },
    calendar: "Adam",
  },
  {
    id: "4",
    title: "Elle's Ballet Recital",
    start: { add: { days: 2, hours: 13 } },
    end: { add: { days: 2, hours: 14 } },
    calendar: "Elle",
  },
  {
    id: "5",
    title: "Family Movie Night",
    start: { add: { days: 4, hours: 19 } },
    end: { add: { days: 4, hours: 21 } },
    calendar: "Family",
  },
  {
    id: "6",
    title: "Parent-Teacher Conference",
    start: { add: { days: -2, hours: 15 } },
    end: { add: { days: -2, hours: 16 } },
    calendar: "Family",
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
  calendars: (FamilyMember | "Family")[];
  toggleCalendar: (calendar: FamilyMember | "Family") => void;
  isLoading: boolean;
  showWorkHours: boolean;
  setShowWorkHours: React.Dispatch<React.SetStateAction<boolean>>;
  businessHoursStart: number;
  businessHoursEnd: number;
  setBusinessHours: (start: number, end: number) => void;
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (typeof window !== "undefined") {
      const savedDate = localStorage.getItem("calendarDate");
      if (savedDate) {
        return new Date(savedDate);
      }
    }
    return startOfToday();
  });

  const [view, setView] = useState<CalendarView>(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem("calendarView");
      return (savedView as CalendarView) || 'workWeek';
    }
    return 'workWeek';
  });

  const [showWorkHours, setShowWorkHours] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("showWorkHours");
        return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  const [businessHoursStart, setBusinessHoursStart] = useState<number>(() => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("businessHoursStart");
        return saved !== null ? JSON.parse(saved) : 8; // 8 AM default
    }
    return 8;
  });

  const [businessHoursEnd, setBusinessHoursEnd] = useState<number>(() => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("businessHoursEnd");
        return saved !== null ? JSON.parse(saved) : 18; // 6 PM default
    }
    return 18;
  });

  const calendars: (FamilyMember | "Family")[] = ["Family", "Adam", "Holly", "Ethan", "Elle"];
  const [activeCalendars, setActiveCalendars] = useState<(FamilyMember | "Family")[]>(calendars);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = startOfToday();
    const processedEvents = rawInitialEvents.map(event => ({
      ...event,
      start: add(currentDate, event.start.add),
      end: add(currentDate, event.end.add),
    }));
    setEvents(processedEvents as CalendarEvent[]);

    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("calendarView", view);
    }
  }, [view]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("showWorkHours", JSON.stringify(showWorkHours));
    }
  }, [showWorkHours]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("businessHoursStart", JSON.stringify(businessHoursStart));
    }
  }, [businessHoursStart]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("businessHoursEnd", JSON.stringify(businessHoursEnd));
    }
  }, [businessHoursEnd]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("calendarDate", currentDate.toISOString());
    }
  }, [currentDate]);

  const toggleCalendar = useCallback((calendar: FamilyMember | "Family") => {
    setActiveCalendars((prev) =>
      prev.includes(calendar)
        ? prev.filter((c) => c !== calendar)
        : [...prev, calendar]
    );
  }, []);

  const setBusinessHours = useCallback((start: number, end: number) => {
    setBusinessHoursStart(start);
    setBusinessHoursEnd(end);
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
    calendars,
    toggleCalendar,
    isLoading,
    showWorkHours,
    setShowWorkHours,
    businessHoursStart,
    businessHoursEnd,
    setBusinessHours,
  }), [events, currentDate, view, activeCalendars, calendars, toggleCalendar, isLoading, showWorkHours, businessHoursStart, businessHoursEnd, setBusinessHours]);

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
