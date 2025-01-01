import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const EventDialog = ({ isOpen, event, onClose }) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title || "No Title"}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            Start: {event.startDate ? new Date(event.startDate).toLocaleString() : "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            End: {event.endDate ? new Date(event.endDate).toLocaleString() : "N/A"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;