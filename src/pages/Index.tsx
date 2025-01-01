import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { EventDialog } from "@/components/EventDialog";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventDialog(true);
  };

  const handleCreateEvent = async (eventData: {
    title: string;
    startDate: Date;
    endDate: Date;
  }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create events.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const { error } = await supabase.from("events").insert([
      {
        title: eventData.title,
        start_date: eventData.startDate.toISOString(),
        end_date: eventData.endDate.toISOString(),
        created_by: user.id,
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } else {
      toast({
        title: "Success",
        description: "Event created successfully.",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowCreateDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 py-8">
        {user && (
          <div className="mb-6 flex justify-end max-w-7xl mx-auto">
            <Button onClick={() => setShowCreateDialog(true)}>
              Create Event
            </Button>
          </div>
        )}

        <Calendar events={events} onDateClick={handleDateClick} />

        {selectedDate && (
          <EventDialog
            isOpen={showEventDialog}
            event={events.find((e) => new Date(e.start_date).toDateString() === selectedDate.toDateString())}
            onClose={() => setShowEventDialog(false)}
          />
        )}

        <CreateEventDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onCreate={handleCreateEvent}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Index;