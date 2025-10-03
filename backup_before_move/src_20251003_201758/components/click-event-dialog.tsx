"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMinutes, format } from "date-fns";
import { useCalendar } from "@/hooks/use-calendar";
import type { CalendarEvent, FamilyMember } from "@/hooks/use-calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ClickEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  time?: string; // For timeline views
  selectedCalendar: (FamilyMember | "Family") | "All";
}

export function ClickEventDialog({ isOpen, onClose, date, time, selectedCalendar }: ClickEventDialogProps) {
  const { setEvents } = useCalendar();
  const [title, setTitle] = useState("");

  // Determine default calendar based on selection
  const getDefaultCalendar = (): FamilyMember | "Family" => {
    if (selectedCalendar === "All") return "Family";
    return selectedCalendar as FamilyMember | "Family";
  };

  const [calendar, setCalendar] = useState<FamilyMember | "Family">(getDefaultCalendar());

  // Set default times
  const getDefaultStartTime = () => {
    if (time) {
      // For timeline clicks, use the clicked time
      return time;
    } else {
      // For month view clicks, use current time or a default
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        // If it's today, use current time
        return format(now, "yyyy-MM-dd'T'HH:mm");
      } else {
        // If it's another day, use 9 AM
        return format(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0), "yyyy-MM-dd'T'HH:mm");
      }
    }
  };

  const [start, setStart] = useState(getDefaultStartTime());
  const [end, setEnd] = useState(() => {
    const startDate = new Date(getDefaultStartTime());
    return format(addMinutes(startDate, 60), "yyyy-MM-dd'T'HH:mm");
  });

  const handleSave = () => {
    if (!title || !start || !end) return;

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title,
      start: new Date(start),
      end: new Date(end),
      calendar: calendar,
    };

    setEvents((prev) => [...prev, newEvent]);

    // Reset form and close dialog
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setCalendar(getDefaultCalendar());
    setStart(getDefaultStartTime());
    setEnd(() => {
      const startDate = new Date(getDefaultStartTime());
      return format(addMinutes(startDate, 60), "yyyy-MM-dd'T'HH:mm");
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Create a new event for {format(date, "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="calendar">Calendar</Label>
            <Select onValueChange={(value: FamilyMember | "Family") => setCalendar(value)} value={calendar}>
              <SelectTrigger id="calendar">
                <SelectValue placeholder="Select a calendar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Family">Family</SelectItem>
                <SelectItem value="Adam">Adam</SelectItem>
                <SelectItem value="Holly">Holly</SelectItem>
                <SelectItem value="Ethan">Ethan</SelectItem>
                <SelectItem value="Elle">Elle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="start">Start Time</Label>
            <Input
              id="start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end">End Time</Label>
            <Input
              id="end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title}>
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}