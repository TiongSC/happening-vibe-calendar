
/* Fixed CalendarEvent.tsx */

import React from 'react';

function CalendarEvent({ event, onClick }) {
  try {
    return (
      <div className="calendar-event" onClick={onClick}>
        <p>{event.title}</p>
        <p>{new Date(event.startDate).toLocaleDateString()}</p>
      </div>
    );
  } catch (error) {
    console.error("Error rendering CalendarEvent:", error);
    return null;
  }
}

export default CalendarEvent;


/*import { Crown } from "lucide-react";

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
};*/