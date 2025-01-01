/* Updated Contents of Calendar.tsx */

import React, { useState } from 'react';
import CalendarEvent from './calendar/CalendarEvent';
import EventDialog from './EventDialog';

function Calendar({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const filterEventsForDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);

      return normalizedDate >= eventStart && normalizedDate <= eventEnd;
    });
  };

  return (
    <div className="calendar">
      {events.map((event, index) => (
        <CalendarEvent
          key={index}
          event={event}
          onClick={() => handleEventClick(event)}
        />
      ))}

      {selectedDate && (
        <div className="events-for-date">
          <h2>Events for {selectedDate.toLocaleDateString()}</h2>
          {filterEventsForDate(selectedDate).map((event, index) => (
            <CalendarEvent
              key={index}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </div>
      )}

      <EventDialog
        open={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}

export default Calendar;

/*import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarDay } from "./calendar/CalendarDay";

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

  // Query to get VIP status for all users
  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      return isSameDay(date, startDate) || (date >= startDate && date <= endDate);
    });
  };

  const isVipEvent = (event: Event) => {
    const creator = profiles?.find(profile => profile.id === event.created_by);
    return creator?.is_vip || false;
  };

  return (
    <div className="w-full mx-auto p-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

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
        {days.map((day) => (
          <CalendarDay
            key={day.toISOString()}
            day={day}
            currentDate={currentDate}
            events={getEventsForDate(day)}
            isVipEvent={isVipEvent}
            onDateClick={onDateClick}
          />
        ))}
      </div>
    </div>
  );
};*/