import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface EventDialogProps {
  isOpen: boolean;
  event: {
    title: string;
    startDate: string;
    endDate: string;
  } | null;
  onClose: () => void;
}

export const EventDialog = ({ isOpen, event, onClose }: EventDialogProps) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p>Start: {new Date(event.startDate).toLocaleString()}</p>
          <p>End: {new Date(event.endDate).toLocaleString()}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};