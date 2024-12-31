import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { format } from "date-fns";

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
}

export const EventDialog = ({ isOpen, onClose, date, events }: EventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Events for {format(date, "MMMM d, yyyy")}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-lg bg-gray-50"
            >
              <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <div className="text-xs text-gray-500">
                <p>
                  From: {format(new Date(event.start_date), "MMM d, yyyy h:mm a")}
                </p>
                <p>To: {format(new Date(event.end_date), "MMM d, yyyy h:mm a")}</p>
                <p className="mt-1">Created by: {event.created_by}</p>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-center text-gray-500">No events for this date</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};