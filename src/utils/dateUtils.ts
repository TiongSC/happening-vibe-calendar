import { startOfDay, endOfDay, isWithinInterval } from "date-fns";

export const isEventInDay = (event: {
  start_date: string;
  end_date: string;
}, date: Date) => {
  const eventStart = new Date(event.start_date);
  const eventEnd = new Date(event.end_date);
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return isWithinInterval(dayStart, {
    start: eventStart,
    end: eventEnd,
  }) || isWithinInterval(dayEnd, {
    start: eventStart,
    end: eventEnd,
  }) || isWithinInterval(eventStart, {
    start: dayStart,
    end: dayEnd,
  });
};