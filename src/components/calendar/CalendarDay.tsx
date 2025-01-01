import { format, isSameMonth, isToday } from "date-fns";
import { CalendarEvent } from "./CalendarEvent";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
}

interface CalendarDayProps {
  day: Date;
  currentDate: Date;
  events: Event[];
  isVipEvent: (event: Event) => boolean;
  onDateClick: (date: Date) => void;
}

export const CalendarDay = ({
  day,
  currentDate,
  events,
  isVipEvent,
  onDateClick,
}: CalendarDayProps) => {
  // Sort events with VIP events first
  const sortedEvents = [...events].sort((a, b) => {
    const aIsVip = isVipEvent(a);
    const bIsVip = isVipEvent(b);
    if (aIsVip && !bIsVip) return -1;
    if (!aIsVip && bIsVip) return 1;
    return 0;
  });

  return (
    <div
      onClick={() => onDateClick(day)}
      className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
        !isSameMonth(day, currentDate)
          ? "bg-gray-100 text-gray-400"
          : "bg-white"
      } ${isToday(day) ? "border-primary" : "border-gray-200"}`}
    >
      <div className="text-right text-sm mb-1">{format(day, "d")}</div>
      <div className="space-y-1">
        {sortedEvents.slice(0, 3).map((event) => (
          <CalendarEvent
            key={event.id}
            title={event.title}
            isVip={isVipEvent(event)}
          />
        ))}
        {sortedEvents.length > 3 && (
          <div className="text-xs text-gray-500">
            +{sortedEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};