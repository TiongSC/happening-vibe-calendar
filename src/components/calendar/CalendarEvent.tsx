import { Crown } from "lucide-react";

interface CalendarEventProps {
  title: string;
  isVip: boolean;
}

export const CalendarEvent = ({ title, isVip }: CalendarEventProps) => {
  return (
    <div
      className={`text-xs p-1 rounded flex items-center gap-1 ${
        isVip ? "bg-secondary/20 text-secondary-foreground" : "bg-primary/10 text-primary"
      }`}
    >
      {isVip && <Crown className="h-3 w-3 fill-secondary-foreground/30" />}
      <div className="font-medium truncate">{title}</div>
    </div>
  );
};