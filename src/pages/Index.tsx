import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/Calendar";
import { EventDialog } from "@/components/EventDialog";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCog, Info, User, HelpCircle, Mail } from "lucide-react";

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

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
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
        duration: 3000,
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
        duration: 3000,
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Button
              variant="link"
              className="text-3xl font-bold text-primary p-0"
              onClick={() => navigate("/")}
            >
              Happening Vibe
            </Button>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {profile?.username || user.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate("/account-settings")}
                  >
                    <UserCog className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate("/login?view=sign_up")}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
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

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-center space-x-8">
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/account-settings")}>
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
