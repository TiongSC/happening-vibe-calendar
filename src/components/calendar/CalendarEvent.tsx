import React from 'react';

interface CalendarEventProps {
  event: {
    title: string;
    startDate: Date;
    endDate: Date;
  };
  onClick: () => void;
}

function CalendarEvent({ event, onClick }: CalendarEventProps) {
  return (
    <div 
      className="calendar-event p-2 bg-primary/10 rounded cursor-pointer hover:bg-primary/20 transition-colors"
      onClick={onClick}
    >
      <p className="font-medium text-sm">{event.title}</p>
      <p className="text-xs text-gray-600">
        {new Date(event.startDate).toLocaleDateString()}
      </p>
    </div>
  );
}

export default CalendarEvent;