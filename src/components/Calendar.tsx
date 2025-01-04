import { useState } from "react";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarDay } from "./calendar/CalendarDay";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

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
  
  // Get the start of the week for the first day of the month
  const calendarStart = startOfWeek(monthStart);
  // Get the end of the week for the last day of the month
  const calendarEnd = endOfWeek(monthEnd);
  
  // Get all days that should be displayed in the calendar
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const { user } = useAuth();

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  const isVipEvent = (event: Event) => {
    const creator = profiles?.find(profile => profile.id === event.created_by);
    return creator?.is_vip || false;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-700"
          >
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = events.filter((event) => {
            const startDate = new Date(event.start_date);
            const endDate = new Date(event.end_date);
            const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
            return dateRange.some(d => isSameDay(d, day));
          });

          return (
            <CalendarDay
              key={day.toISOString()}
              day={day}
              currentMonth={currentDate}
              events={dayEvents}
              isVipEvent={isVipEvent}
              onClick={() => onDateClick(day)}
            />
          );
        })}
      </div>
    </div>
  );
};