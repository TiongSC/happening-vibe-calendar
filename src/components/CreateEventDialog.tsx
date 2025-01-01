import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: { title: string; startDate: Date; endDate: Date }) => void;
}

function CreateEventDialog({ isOpen, onClose, onCreate }: CreateEventDialogProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'));

  const handleCreate = () => {
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date.');
      return;
    }

    onCreate({
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">Event Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
            <Input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
            <Input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateEventDialog;