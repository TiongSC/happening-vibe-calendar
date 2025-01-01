import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
}

interface EventDialogProps {
  isOpen: boolean;
  event: Event | null;
  onClose: () => void;
}

export const EventDialog: React.FC<EventDialogProps> = ({ isOpen, event, onClose }) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title || "No Title"}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            Start: {new Date(event.start_date).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            End: {new Date(event.end_date).toLocaleString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};