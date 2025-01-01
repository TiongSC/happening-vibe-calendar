import React from 'react';

const CalendarEvent = ({ event, onClick }) => {
  if (!event) return null;

  return (
    <div className="calendar-event" onClick={onClick}>
      <p>{event.title || "Untitled Event"}</p>
      <p>{event.startDate ? new Date(event.startDate).toLocaleDateString() : "Invalid Date"}</p>
    </div>
  );
};

export default CalendarEvent;