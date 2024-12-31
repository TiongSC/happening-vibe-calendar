import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { EventDialog } from "@/components/EventDialog";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Mock data for initial testing
const mockEvents = [
  {
    id: "1",
    title: "VIP Event",
    description: "A special VIP event",
    startDate: new Date(2024, 2, 15, 10, 0),
    endDate: new Date(2024, 2, 16, 18, 0),
    isVIP: true,
    createdBy: "admin",
  },
  {
    id: "2",
    title: "Regular Event",
    description: "A regular event",
    startDate: new Date(2024, 2, 15, 14, 0),
    endDate: new Date(2024, 2, 15, 16, 0),
    createdBy: "user1",
  },
];

const Index = () => {
  const [events, setEvents] = useState(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventDialog(true);
  };

  const handleCreateEvent = (eventData: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
  }) => {
    const newEvent = {
      id: Math.random().toString(),
      ...eventData,
      createdBy: "user1", // This would come from auth
    };

    setEvents([...events, newEvent]);
    toast({
      title: "Event created",
      description: "Your event has been successfully created.",
    });
  };

  const eventsForDate = (date: Date | null) =>
    date
      ? events.filter(
          (event) =>
            date >= new Date(event.startDate) &&
            date <= new Date(event.endDate)
        )
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Happening Vibe</h1>
            <div className="space-x-2">
              <Button variant="outline">Sign In</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setShowCreateDialog(true)}>
            Create Event
          </Button>
        </div>

        <Calendar events={events} onDateClick={handleDateClick} />

        {selectedDate && (
          <EventDialog
            isOpen={showEventDialog}
            onClose={() => setShowEventDialog(false)}
            date={selectedDate}
            events={eventsForDate(selectedDate)}
          />
        )}

        <CreateEventDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onCreateEvent={handleCreateEvent}
          selectedDate={new Date()}
        />
      </main>
    </div>
  );
};

export default Index;