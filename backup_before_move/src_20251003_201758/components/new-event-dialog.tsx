
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMinutes, format } from "date-fns";
import { Plus } from "lucide-react";
import { useCalendar } from "@/hooks/use-calendar";
import type { CalendarEvent, FamilyMember } from "@/hooks/use-calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function NewEventDialog({ defaultDate, defaultCalendar }: { defaultDate?: Date; defaultCalendar?: FamilyMember | "Family" }) {
  const { setEvents } = useCalendar();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [calendar, setCalendar] = useState<FamilyMember | "Family">(defaultCalendar || "Family");
  const [start, setStart] = useState(
    defaultDate ? format(defaultDate, "yyyy-MM-dd'T'HH:mm") : ""
  );
  const [end, setEnd] = useState(
    defaultDate ? format(addMinutes(defaultDate, 30), "yyyy-MM-dd'T'HH:mm") : ""
  );

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
    setTitle("");
    setCalendar(defaultCalendar || "Family");
    setStart(defaultDate ? format(defaultDate, "yyyy-MM-dd'T'HH:mm") : "");
    setEnd(
      defaultDate
        ? format(addMinutes(defaultDate, 30), "yyyy-MM-dd'T'HH:mm")
        : ""
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Event</DialogTitle>
          <DialogDescription>
            Create a calendar event. Fill in details and click Save.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Team meeting"
            />
          </div>
           <div className="grid gap-2">
                <Label htmlFor="calendar">Calendar</Label>
                <Select onValueChange={(value: FamilyMember | "Family") => setCalendar(value)} defaultValue={calendar}>
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
            <Label htmlFor="start">Start</Label>
            <Input
              id="start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end">End</Label>
            <Input
              id="end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
