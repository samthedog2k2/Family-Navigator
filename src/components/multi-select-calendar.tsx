"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCalendarColor } from "./family-calendar";
import type { FamilyMember } from "@/hooks/use-calendar";

interface MultiSelectCalendarProps {
  calendars: (FamilyMember | "Family")[];
  selectedCalendars: (FamilyMember | "Family")[];
  onSelectionChange: (selected: (FamilyMember | "Family")[]) => void;
  className?: string;
}

export function MultiSelectCalendar({
  calendars,
  selectedCalendars,
  onSelectionChange,
  className
}: MultiSelectCalendarProps) {
  const [open, setOpen] = React.useState(false);

  const toggleCalendar = (calendar: FamilyMember | "Family") => {
    if (selectedCalendars.includes(calendar)) {
      onSelectionChange(selectedCalendars.filter(c => c !== calendar));
    } else {
      onSelectionChange([...selectedCalendars, calendar]);
    }
  };

  const toggleAll = () => {
    if (selectedCalendars.length === calendars.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...calendars]);
    }
  };

  const getDisplayText = () => {
    if (selectedCalendars.length === 0) {
      return "Select calendars";
    } else if (selectedCalendars.length === calendars.length) {
      return "All Calendars";
    } else if (selectedCalendars.length === 1) {
      return selectedCalendars[0];
    } else {
      return `${selectedCalendars.length} calendars selected`;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {getDisplayText()}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-2">
          {/* Select All option */}
          <div
            className="flex items-center space-x-3 rounded-md hover:bg-accent/50 p-2 cursor-pointer transition-colors"
            onClick={toggleAll}
          >
            <Checkbox
              checked={selectedCalendars.length === calendars.length}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label className="flex-1 text-sm font-medium cursor-pointer">
              All Calendars
            </Label>
          </div>

          <div className="border-t pt-2">
            {calendars.map((calendar) => {
              const color = getCalendarColor(calendar);
              const isSelected = selectedCalendars.includes(calendar);

              return (
                <div
                  key={calendar}
                  className="flex items-center space-x-3 rounded-md hover:bg-accent/50 p-2 cursor-pointer transition-colors"
                  onClick={() => toggleCalendar(calendar)}
                >
                  <Checkbox
                    checked={isSelected}
                    className="data-[state=checked]:text-white"
                    style={{
                      backgroundColor: isSelected ? color.color : 'transparent',
                      borderColor: color.color,
                    }}
                  />
                  <Label className="flex-1 text-sm font-medium cursor-pointer">
                    {calendar}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}