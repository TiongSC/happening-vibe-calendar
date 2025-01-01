import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface EventDialogProps {
  isOpen: boolean;
  event: {
    title: string;
    startDate: Date;
    endDate: Date;
  } | null;
  onClose: () => void;
}

function EventDialog({ isOpen, event, onClose }: EventDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            Start: {format(new Date(event.startDate), "PPpp")}
          </p>
          <p className="text-sm text-gray-600">
            End: {format(new Date(event.endDate), "PPpp")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EventDialog;