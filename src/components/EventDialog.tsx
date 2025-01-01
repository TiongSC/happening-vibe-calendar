import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { format, isSameDay, startOfDay, endOfDay } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { Trash2, Crown, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CreateEventDialog } from "./CreateEventDialog";

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
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Query to get all user profiles
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
        variant: "destructive"
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
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Event deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  };

  const onCreateEvent = async () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
    setShowCreateDialog(false);
  };

  const getUserName = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile?.username || profile?.id || userId;
  };

  const isVipEvent = (event: Event) => {
    const creator = profiles?.find(profile => profile.id === event.created_by);
    return creator?.is_vip || false;
  };

  // Filter and sort events for the selected date
  const eventsForDate = events
    .filter(event => {
      const eventStart = startOfDay(new Date(event.start_date));
      const eventEnd = endOfDay(new Date(event.end_date));
      const selectedDate = startOfDay(date);
      return selectedDate >= eventStart && selectedDate <= eventEnd;
    })
    .sort((a, b) => {
      const aIsVip = isVipEvent(a);
      const bIsVip = isVipEvent(b);
      if (aIsVip && !bIsVip) return -1;
      if (!aIsVip && bIsVip) return 1;
      return 0;
    });

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
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              )}
            </div>
            <DialogDescription>
              View all events scheduled for this date
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {eventsForDate.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg ${
                    isVipEvent(event) ? "bg-secondary/20" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {isVipEvent(event) && (
                        <Crown className="h-4 w-4 fill-secondary-foreground/30" />
                      )}
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                    </div>
                    {(user?.id === event.created_by || profiles?.find(p => p.id === user?.id)?.is_admin) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEvent(event.id, event.created_by)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  <div className="text-xs text-gray-500">
                    <p>Duration: {format(new Date(event.start_date), "MMM d, yyyy h:mm a")} - {format(new Date(event.end_date), "MMM d, yyyy h:mm a")}</p>
                    <p className="mt-1">Created by: {getUserName(event.created_by)}</p>
                  </div>
                </div>
              ))}
              {eventsForDate.length === 0 && (
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
          onCreateEvent={onCreateEvent}
          selectedDate={date}
        />
      )}
    </>
  );
};
