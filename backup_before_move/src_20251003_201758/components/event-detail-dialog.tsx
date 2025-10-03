
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { CalendarEvent } from "@/hooks/use-calendar";

export function EventDetailDialog({ event, onClose }: { event: CalendarEvent | null; onClose: () => void }) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            {format(event.start, "eeee, MMMM d, yyyy")} <br />
            {format(event.start, "h:mm a")} – {format(event.end, "h:mm a")}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p><strong>Calendar:</strong> {event.calendar}</p>
          {/* You can extend with location, notes, etc. */}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
