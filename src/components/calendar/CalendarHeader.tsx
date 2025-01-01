import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button variant="ghost" onClick={onPrevMonth}>
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <h2 className="text-2xl font-bold text-primary">
        {format(currentDate, "MMMM yyyy")}
      </h2>
      <Button variant="ghost" onClick={onNextMonth}>
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};