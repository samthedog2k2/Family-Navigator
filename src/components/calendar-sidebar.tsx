"use client";

import * as React from "react";
import { format, startOfToday, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isSameMonth, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Eye, EyeOff, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelectCalendar } from "./multi-select-calendar";
import { useCalendar } from "@/hooks/use-calendar";
import type { CalendarView } from "@/hooks/use-calendar";
import { getCalendarColor } from "./family-calendar";
import { Separator } from "./ui/separator";

interface CalendarSidebarProps {
  onDateSelect?: (date: Date) => void;
  className?: string;
}

function MiniCalendar({ onDateSelect }: { onDateSelect?: (date: Date) => void }) {
  const { currentDate, setCurrentDate } = useCalendar();
  const [viewDate, setViewDate] = React.useState(currentDate);

  const today = startOfToday();
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = [
    { key: "sun", label: "S" },
    { key: "mon", label: "M" },
    { key: "tue", label: "T" },
    { key: "wed", label: "W" },
    { key: "thu", label: "T" },
    { key: "fri", label: "F" },
    { key: "sat", label: "S" }
  ];
  const startPadding = getDay(monthStart);

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    onDateSelect?.(date);
  };

  return (
    <div className="p-3 border-b">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{format(viewDate, "MMMM yyyy")}</h3>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            className="h-6 w-6 p-0"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            className="h-6 w-6 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 text-xs">
        {weekDays.map((day) => (
          <div key={day.key} className="h-6 flex items-center justify-center text-muted-foreground font-medium">
            {day.label}
          </div>
        ))}

        {Array.from({ length: startPadding }).map((_, index) => (
          <div key={`padding-${index}`} className="h-6" />
        ))}

        {calendarDays.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => handleDateClick(day)}
            className={cn(
              "h-6 w-6 text-xs flex items-center justify-center rounded hover:bg-accent transition-colors",
              !isSameMonth(day, viewDate) && "text-muted-foreground/50",
              isSameDay(day, currentDate) && "bg-primary text-primary-foreground font-semibold",
              isToday(day) && !isSameDay(day, currentDate) && "bg-accent font-semibold"
            )}
          >
            {format(day, "d")}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CalendarSidebar({ onDateSelect, className }: CalendarSidebarProps) {
  const { calendars, activeCalendars, setActiveCalendars, showWorkHours, setShowWorkHours, view, setView } = useCalendar();
  const [allVisible, setAllVisible] = React.useState(true);

  const handleToggleAll = () => {
    const newVisible = !allVisible;
    setAllVisible(newVisible);
    // Implementation would need to be added to useCalendar hook
  };

  return (
    <div className={cn("w-64 bg-background border-r flex flex-col", className)}>
      <MiniCalendar onDateSelect={onDateSelect} />

      <div className="flex-1 p-3">
        {/* Calendar View Dropdown with Business Hours Toggle */}
        <div className="mb-4">
          <Label className="text-sm font-semibold mb-2 block">View</Label>
          <Select value={view} onValueChange={(v) => setView(v as CalendarView)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="workWeek">Work Week</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>

          {/* Business Hours Toggle under View */}
          {view !== 'month' && (
            <div className="mt-3">
              <div
                className="flex items-center space-x-3 rounded-md hover:bg-accent/50 p-2 cursor-pointer transition-colors"
                onClick={() => setShowWorkHours(!showWorkHours)}
              >
                <Checkbox
                  checked={showWorkHours}
                  onChange={() => {}}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label className="flex-1 text-sm cursor-pointer">
                  Business Hours (8 AM - 6 PM)
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Multi-Selection */}
        <div className="mb-4">
          <Label className="text-sm font-semibold mb-2 block">Calendar</Label>
          <MultiSelectCalendar
            calendars={calendars}
            selectedCalendars={activeCalendars}
            onSelectionChange={setActiveCalendars}
          />
        </div>



      </div>
    </div>
  );
}