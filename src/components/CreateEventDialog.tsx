import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: {
    title: string;
    startDate: Date;
    endDate: Date;
  }) => void;
  selectedDate: Date;
}

export const CreateEventDialog = ({
  isOpen,
  onClose,
  onCreate,
  selectedDate,
}: CreateEventDialogProps) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);

  const handleCreate = () => {
    if (startDate > endDate) {
      alert("Start date must be before end date.");
      return;
    }

    onCreate({ title, startDate, endDate });
    onClose();
    setTitle("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Input
              type="datetime-local"
              value={startDate.toISOString().slice(0, 16)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <Input
              type="datetime-local"
              value={endDate.toISOString().slice(0, 16)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};