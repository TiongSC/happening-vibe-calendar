import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id
  });

  // Set form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setPhoneNumber(profile.phone_number || "");
      setBirthday(profile.birthday || "");
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { username?: string; phone_number: string; birthday: string }) => {
      if (!user?.id) throw new Error("No user");
      
      // Check if username exists (if username is being updated)
      if (updates.username) {
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", updates.username)
          .neq("id", user.id)
          .maybeSingle();

        if (existingUser) {
          throw new Error("This username is already taken. Please choose another one.");
        }
      }

      const finalUpdates: { username?: string; phone_number: string; birthday: string | null } = {
        username: updates.username,
        phone_number: updates.phone_number,
        birthday: updates.birthday || null // Handle empty birthday string
      };

      const { error } = await supabase
        .from("profiles")
        .update(finalUpdates)
        .eq("id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ 
      username,
      phone_number: phoneNumber,
      birthday
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header profile={profile} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">Account Settings</h1>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Set your username"
                />
              </div>

              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t">
              <h2 className="text-lg font-semibold mb-4">Account Status</h2>
              <div className="space-y-2">
                <p>
                  Account Type: {profile?.is_vip ? "VIP User" : "Regular User"}
                </p>
                <p>
                  Events Remaining Today: {profile?.events_remaining_today}
                </p>
                {profile?.is_admin && (
                  <p className="text-primary">Administrator Account</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountSettings;