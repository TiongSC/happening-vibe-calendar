import { format } from "date-fns";
import { Crown, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "./AuthProvider";
import { EventItem } from "./EventItem";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
}

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: Event[];
  onCreateClick: (date: Date) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventDialog = ({
  isOpen,
  onClose,
  date,
  events,
  onCreateClick,
  onDeleteEvent,
}: EventDialogProps) => {
  const { user } = useAuth();

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Events on {format(date, "MMMM dd, yyyy")}</DialogTitle>
        </DialogHeader>
        <ScrollArea>
          {events.map((event) => (
            <EventItem key={event.id} event={event} onDeleteEvent={onDeleteEvent} />
          ))}
        </ScrollArea>
        <Button onClick={() => onCreateClick(date)}>
          <Plus size={16} /> Create Event
        </Button>
      </DialogContent>
    </Dialog>
  );
};
