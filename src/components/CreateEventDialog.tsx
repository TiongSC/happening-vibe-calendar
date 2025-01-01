import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { format } from "date-fns";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: {
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
  onCreate,
  selectedDate,
}: CreateEventDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(format(selectedDate, "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState(format(selectedDate, "yyyy-MM-dd"));
  const [endTime, setEndTime] = useState("17:00");
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
    
    onCreate({
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 50))}
              maxLength={50}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {50 - title.length} characters remaining
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              required
              className="whitespace-pre-wrap break-words resize-none"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {200 - description.length} characters remaining
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Create Event Limits: {remainingEvents}
          </p>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};