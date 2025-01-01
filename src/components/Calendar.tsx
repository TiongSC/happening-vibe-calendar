import React, { useState } from 'react';
import CalendarEvent from './calendar/CalendarEvent';
import EventDialog from './EventDialog';

const Calendar = ({ events }) => {
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
        isOpen={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};

export default Calendar;