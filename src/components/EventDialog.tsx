import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: {
    id: string;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string;
    created_by: string;
    created_at: string;
  }[];
}

export const EventDialog = ({ isOpen, onClose, date, events }: EventDialogProps) => {
  const eventsForDate = events.filter(event => {
    const eventDate = new Date(event.start_date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Events for {date.toLocaleDateString()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {eventsForDate.length === 0 ? (
            <p className="text-center text-gray-500">No events for this date</p>
          ) : (
            eventsForDate.map(event => (
              <div key={event.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{event.title}</h3>
                {event.description && <p className="text-gray-600">{event.description}</p>}
                <div className="mt-2 text-sm text-gray-500">
                  <p>Start: {new Date(event.start_date).toLocaleString()}</p>
                  <p>End: {new Date(event.end_date).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};