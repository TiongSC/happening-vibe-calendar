import { format, eachDayOfInterval } from "date-fns";
import { Crown, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { EventItem } from "./EventItem";

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
  onCreateClick: (date: Date) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventDialog = ({ 
  isOpen, 
  onClose, 
  date, 
  events,
  onCreateClick,
  onDeleteEvent 
}: EventDialogProps) => {
  const { user } = useAuth();

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  const isVipEvent = (event: Event) => {
    const creator = profiles?.find(profile => profile.id === event.created_by);
    return creator?.is_vip || false;
  };

  const canDeleteEvent = (event: Event) => {
    const userProfile = profiles?.find(profile => profile.id === user?.id);
    return userProfile?.is_admin || user?.id === event.created_by;
  };

  const getUserName = (userId: string) => {
    const userProfile = profiles?.find(profile => profile.id === userId);
    if (userProfile?.username) {
      return userProfile.username;
    }
    return "Unknown User";
  };

  const eventsForDate = events.filter(event => {
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    return dateRange.some(d => 
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );
  }).sort((a, b) => {
    const aIsVip = isVipEvent(a);
    const bIsVip = isVipEvent(b);
    if (aIsVip && !bIsVip) return -1;
    if (!aIsVip && bIsVip) return 1;
    return 0;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Events for {format(date, "MMMM d, yyyy")}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end">
          {user && (
            <Button 
              //onClick={() => onCreateClick(date)} 
              onClick={() => onCreateClick(date)}
              size="icon"
              className="rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {eventsForDate.length === 0 ? (
              <p className="text-center text-gray-500">No events for this date</p>
            ) : (
              eventsForDate.map(event => (
                <EventItem
                  key={event.id}
                  event={event}
                  isVipEvent={isVipEvent(event)}
                  canDelete={canDeleteEvent(event)}
                  onDelete={() => onDeleteEvent(event.id)}
                  getUserName={getUserName}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};