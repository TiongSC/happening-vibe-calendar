import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { format, isSameDay, startOfDay, endOfDay } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { Trash2, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

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

  // Query to get all user profiles
  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  const getUserName = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile?.username || profile?.id || userId;
  };

  const isVipEvent = (event: Event) => {
    const creator = profiles?.find(profile => profile.id === event.created_by);
    return creator?.is_vip || false;
  };

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
    },
  });

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

  const handleDeleteEvent = (eventId: string, createdBy: string) => {
    const userProfile = profiles?.find(p => p.id === user?.id);
    if (user?.id !== createdBy && !userProfile?.is_admin) {
      toast({
        title: "Permission denied",
        description: "You can only delete your own events.",
        variant: "destructive",
      });
      return;
    }
    deleteEventMutation.mutate(eventId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Events for {format(date, "MMMM d, yyyy")}</DialogTitle>
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
  );
};