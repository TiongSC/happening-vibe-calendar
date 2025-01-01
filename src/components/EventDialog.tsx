
/* Updated Contents of EventDialog.tsx */

import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

function EventDialog({ open, event, onClose }) {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent>
        <p>Start: {new Date(event.startDate).toLocaleString()}</p>
        <p>End: {new Date(event.endDate).toLocaleString()}</p>
      </DialogContent>
    </Dialog>
  );
}

export default EventDialog;




/*import { Dialog, DialogContent } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CreateEventDialog } from "./CreateEventDialog";
import { EventItem } from "./EventItem";
import { EventHeader } from "./event/EventHeader";
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
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ['events'] });
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

    // Check daily event creation limit
    const { data: eventCount } = await supabase.rpc(
      'get_user_daily_event_count',
      { 
        user_id: user.id,
        check_date: eventData.startDate.toISOString().split('T')[0]
      }
    );

    const isAdmin = profiles?.find(p => p.id === user.id)?.is_admin;

    if (!isAdmin && eventCount >= 2) {
      toast({
        title: "Daily limit reached",
        description: "You can only create 2 events per day.",
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
      queryClient.invalidateQueries({ queryKey: ['events'] });
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

  // Filter events for the selected day
  const filteredEvents = events.filter(event => isEventInDay(event, date));

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <EventHeader
            date={date}
            user={user}
            onCreateClick={() => setShowCreateDialog(true)}
          />
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
}; */