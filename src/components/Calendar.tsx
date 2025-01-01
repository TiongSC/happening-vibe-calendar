import React, { useState } from 'react';
import CalendarEvent from './calendar/CalendarEvent';
import { EventDialog } from './EventDialog';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
}

interface CalendarProps {
  events: Event[];
  onDateClick: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ events, onDateClick }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick(date);
  };

  const filterEventsForDate = (date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);

      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);

      return normalizedDate >= eventStart && normalizedDate <= eventEnd;
    });
  };

  return (
    <div className="calendar">
      {events.map((event) => (
        <CalendarEvent
          key={event.id}
          event={event}
          onClick={() => handleEventClick(event)}
        />
      ))}

      {selectedDate && (
        <div className="events-for-date">
          <h2>Events for {selectedDate.toLocaleDateString()}</h2>
          {filterEventsForDate(selectedDate).map((event) => (
            <CalendarEvent
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </div>
      )}

      <EventDialog
        isOpen={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};