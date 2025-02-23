import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { format } from "date-fns";
import { EventForm } from "./event/EventForm";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: {
    title: string;
    description: string;
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
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(format(selectedDate, "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(selectedDate, "yyyy-MM-dd"));

  useEffect(() => {
    if (isOpen) {
      setStartDate(format(selectedDate, "yyyy-MM-dd"));
      setEndDate(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [isOpen, selectedDate]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event on {format(selectedDate, "MMMM dd, yyyy")}</DialogTitle>
        </DialogHeader>
        <EventForm 
          title={title} 
          setTitle={setTitle} 
          description={description} 
          setDescription={setDescription} 
          startDate={startDate} 
          setStartDate={setStartDate} 
          endDate={endDate} 
          setEndDate={setEndDate}
        />
      </DialogContent>
    </Dialog>
  );
};