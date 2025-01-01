import { startOfDay, endOfDay, isWithinInterval } from "date-fns";

export const isEventInDay = (event: {
  start_date: string;
  end_date: string;
}, date: Date) => {
  const eventStart = new Date(event.start_date);
  const eventEnd = new Date(event.end_date);
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  // Check if the event starts or ends within the day
  const startsWithinDay = isWithinInterval(eventStart, { start: dayStart, end: dayEnd });
  const endsWithinDay = isWithinInterval(eventEnd, { start: dayStart, end: dayEnd });
  
  // Check if the day falls entirely within the event range
  const dayWithinEvent = isWithinInterval(dayStart, { start: eventStart, end: eventEnd });

  return startsWithinDay || endsWithinDay || dayWithinEvent;
};