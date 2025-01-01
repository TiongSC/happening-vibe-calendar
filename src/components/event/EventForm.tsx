import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EventFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  remainingEvents: string | number;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const EventForm = ({
  title,
  setTitle,
  description,
  setDescription,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  remainingEvents,
  onSubmit,
  onClose,
}: EventFormProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (remainingEvents !== "∞" && Number(remainingEvents) <= 0) {
      toast({
        title: "Event Creation Limit Reached",
        description: "You have reached your daily event creation limit.",
        duration: 3000,
        variant: "destructive",
      });
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      toast({
        title: "Invalid Date Range",
        description: "End date and time must be after start date and time.",
        duration: 3000,
        variant: "destructive",
      });
      return;
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 50))}
          maxLength={50}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {50 - title.length} characters remaining
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 200))}
          required
          className="whitespace-pre-wrap break-words resize-none"
          rows={3}
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">
          {200 - description.length} characters remaining
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
      <p className="text-sm text-gray-500">
        Events remaining today: {remainingEvents}
      </p>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={remainingEvents !== "∞" && Number(remainingEvents) <= 0}
        >
          Create
        </Button>
      </div>
    </form>
  );
};