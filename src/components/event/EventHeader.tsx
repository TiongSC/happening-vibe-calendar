import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";

interface EventHeaderProps {
  date: Date;
  user: any;
  onCreateClick: () => void;
}

export const EventHeader = ({ date, user, onCreateClick }: EventHeaderProps) => {
  return (
    <DialogHeader>
      <div className="flex justify-between items-center">
        <DialogTitle>Events for {format(date, "MMMM d, yyyy")}</DialogTitle>
        {user && (
          <Button 
            onClick={onCreateClick} 
            size="icon"
            className="rounded-full mr-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      <DialogDescription>
        View all events scheduled for this date
      </DialogDescription>
    </DialogHeader>
  );
};