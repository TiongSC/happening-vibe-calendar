import { format } from "date-fns";
import { Crown, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

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
  onCreateClick: () => void;
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

  const eventsForDate = events.filter(event => {
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const checkDate = date;
    return checkDate >= startDate && checkDate <= endDate;
  }).sort((a, b) => {
    // Sort VIP events first
    const aIsVip = isVipEvent(a);
    const bIsVip = isVipEvent(b);
    if (aIsVip && !bIsVip) return -1;
    if (!aIsVip && bIsVip) return 1;
    return 0;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Events for {format(date, "MMMM d, yyyy")}</DialogTitle>
            <Button 
              onClick={onCreateClick} 
              size="icon"
              className="rounded-full mr-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {eventsForDate.length === 0 ? (
              <p className="text-center text-gray-500">No events for this date</p>
            ) : (
              eventsForDate.map(event => (
                <div 
                  key={event.id} 
                  className={`p-4 rounded-lg relative ${
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
                    {user?.id === event.created_by && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap break-words">{event.description}</p>
                  <div className="text-xs text-gray-500">
                    <p>Start: {format(new Date(event.start_date), "MMM d, yyyy h:mm a")}</p>
                    <p>End: {format(new Date(event.end_date), "MMM d, yyyy h:mm a")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};