import { format } from "date-fns";
import { Crown, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  created_by: string;
}

interface EventItemProps {
  event: Event;
  isVipEvent: boolean;
  canDelete: boolean;
  onDelete: () => void;
  getUserName: (userId: string) => string;
}

export const EventItem = ({
  event,
  isVipEvent,
  canDelete,
  onDelete,
  getUserName,
}: EventItemProps) => {
  return (
    <div
      className={`p-4 rounded-lg ${
        isVipEvent ? "bg-secondary/20" : "bg-gray-50"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {isVipEvent && (
            <Crown className="h-4 w-4 fill-secondary-foreground/30" />
          )}
          <h3 className="font-semibold text-lg">{event.title}</h3>
        </div>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap break-words">{event.description}</p>
      <div className="text-xs text-gray-500">
        <p>
          Duration: {format(new Date(event.start_date), "MMM d, yyyy h:mm a")} -{" "}
          {format(new Date(event.end_date), "MMM d, yyyy h:mm a")}
        </p>
        <p className="mt-1">Created by: {getUserName(event.created_by)}</p>
      </div>
    </div>
  );
};