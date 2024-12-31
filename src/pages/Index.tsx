import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/Calendar";
import { EventDialog } from "@/components/EventDialog";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const createEventMutation = useMutation({
    mutationFn: async (eventData: {
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
    }) => {
      const { data, error } = await supabase.from("events").insert([
        {
          title: eventData.title,
          description: eventData.description,
          start_date: eventData.startDate.toISOString(),
          end_date: eventData.endDate.toISOString(),
          created_by: user?.id,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Event created",
        description: "Your event has been successfully created.",
      });
    },
  });

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
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create events.",
        variant: "destructive",
      });
      return;
    }
    createEventMutation.mutate(eventData);
    setShowCreateDialog(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const eventsForDate = (date: Date | null) =>
    date
      ? events.filter(
          (event) =>
            date >= new Date(event.start_date) &&
            date <= new Date(event.end_date)
        )
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Happening Vibe</h1>
            <div className="space-x-2">
              {user ? (
                <>
                  <span className="text-sm text-gray-600 mr-4">
                    Welcome, {user.email}
                  </span>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate("/login")}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {user && (
          <div className="mb-6 flex justify-end">
            <Button onClick={() => setShowCreateDialog(true)}>
              Create Event
            </Button>
          </div>
        )}

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