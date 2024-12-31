import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isVIP?: boolean;
  createdBy: string;
}

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: Event[];
}

export const EventDialog = ({ isOpen, onClose, date, events }: EventDialogProps) => {
  const sortedEvents = [...events].sort((a, b) => {
    if (a.isVIP && !b.isVIP) return -1;
    if (!a.isVIP && b.isVIP) return 1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Events for {format(date, "MMMM d, yyyy")}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg ${
                event.isVIP ? "bg-secondary/20" : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <div className="text-xs text-gray-500">
                <p>
                  From: {format(new Date(event.startDate), "MMM d, yyyy h:mm a")}
                </p>
                <p>To: {format(new Date(event.endDate), "MMM d, yyyy h:mm a")}</p>
                <p className="mt-1">Created by: {event.createdBy}</p>
              </div>
            </div>
          ))}
          {sortedEvents.length === 0 && (
            <p className="text-center text-gray-500">No events for this date</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};