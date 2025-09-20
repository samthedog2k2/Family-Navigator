
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

export function NewEventDialog({ defaultDate }: { defaultDate?: Date }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(
    defaultDate ? format(defaultDate, "yyyy-MM-dd'T'HH:mm") : ""
  );
  const [end, setEnd] = useState(
    defaultDate ? format(addMinutes(defaultDate, 30), "yyyy-MM-dd'T'HH:mm") : ""
  );

  const handleSave = () => {
    console.log("New event created:", { title, start, end });
    // TODO: integrate with your state or API
  };

  return (
    <Dialog>
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

    