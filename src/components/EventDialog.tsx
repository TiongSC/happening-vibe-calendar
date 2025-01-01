import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { format } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CreateEventDialog } from "./CreateEventDialog";
import { EventItem } from "./EventItem";
import { isEventInDay } from "@/utils/dateUtils";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
}

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: Event[];
}

export const EventDialog = ({ isOpen, onClose, date, events }: EventDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  const handleDeleteEvent = async (eventId: string, createdBy: string) => {
    if (!user || (user.id !== createdBy && !profiles?.find(p => p.id === user.id)?.is_admin)) {
      toast({
        title: "Error",
        description: "You don't have permission to delete this event.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } else {
      toast({
        title: "Success",
        description: "Event deleted successfully.",
        duration: 3000,
      });
    }
  };

  const handleCreateEvent = async (eventData: {
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

    const { error } = await supabase.from('events').insert([{
      title: eventData.title,
      description: eventData.description,
      start_date: eventData.startDate.toISOString(),
      end_date: eventData.endDate.toISOString(),
      created_by: user.id,
    }]);

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
      setShowCreateDialog(false);
    }
  };

  const getUserName = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile?.username || profile?.id || userId;
  };

  const isVipEvent = (event: Event) => {
    const creator = profiles?.find(profile => profile.id === event.created_by);
    return creator?.is_vip || false;
  };

  const filteredEvents = events.filter(event => isEventInDay(event, date));

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Events for {format(date, "MMMM d, yyyy")}</DialogTitle>
              {user && (
                <Button 
                  onClick={() => setShowCreateDialog(true)} 
                  size="icon"
                  className="rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <DialogDescription>
              View all events scheduled for this date
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  isVipEvent={isVipEvent(event)}
                  canDelete={
                    user?.id === event.created_by ||
                    !!profiles?.find((p) => p.id === user?.id)?.is_admin
                  }
                  onDelete={() => handleDeleteEvent(event.id, event.created_by)}
                  getUserName={getUserName}
                />
              ))}
              {filteredEvents.length === 0 && (
                <p className="text-center text-gray-500">No events for this date</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {showCreateDialog && (
        <CreateEventDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onCreateEvent={handleCreateEvent}
          selectedDate={date}
        />
      )}
    </>
  );
};