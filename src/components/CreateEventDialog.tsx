import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { EventForm } from "./event/EventForm";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
  }) => void;
  selectedDate: Date;
}

export const CreateEventDialog = ({
  isOpen,
  onClose,
  onCreateEvent,
  selectedDate,
}: CreateEventDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(format(selectedDate, "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState(format(selectedDate, "yyyy-MM-dd"));
  const [endTime, setEndTime] = useState("17:00");
  const { toast } = useToast();
  const { user } = useAuth();

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

  const { data: todayEvents = [] } = useQuery({
    queryKey: ["todayEvents", user?.id, startDate],
    queryFn: async () => {
      if (!user?.id) return [];
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("created_by", user.id)
        .gte("start_date", startOfDay.toISOString())
        .lte("start_date", endOfDay.toISOString());
      return data || [];
    },
    enabled: !!user?.id,
  });

  const remainingEvents = profile?.is_admin ? "∞" : Math.max(0, 2 - (todayEvents?.length || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    if (end <= start) {
      toast({
        title: "Invalid date range",
        description: "End date and time must be after start date and time.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!profile?.is_admin && todayEvents.length >= 2) {
      toast({
        title: "Event limit reached",
        description: "You can only create 2 events per day.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    onCreateEvent({
      title,
      description,
      startDate: start,
      endDate: end,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <EventForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          startDate={startDate}
          setStartDate={setStartDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endDate={endDate}
          setEndDate={setEndDate}
          endTime={endTime}
          setEndTime={setEndTime}
          remainingEvents={remainingEvents}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};