import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
}

interface CalendarProps {
  events: Event[];
  onDateClick: (date: Date) => void;
}

export const Calendar = ({ events, onDateClick }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      return (
        isSameDay(date, startDate) || 
        (date >= startDate && date <= endDate)
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={prevMonth}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold text-primary">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button variant="ghost" onClick={nextMonth}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold p-2 text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayEvents = getEventsForDate(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                !isSameMonth(day, currentDate)
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white"
              } ${isToday(day) ? "border-primary" : "border-gray-200"}`}
            >
              <div className="text-right text-sm mb-1">
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded bg-primary/10 text-primary"
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.description && (
                      <div className="text-[10px] text-gray-600 mt-0.5 line-clamp-2">
                        {event.description}
                      </div>
                    )}
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {format(new Date(event.start_date), "h:mm a")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};