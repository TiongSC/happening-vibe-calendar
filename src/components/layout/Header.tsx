import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const Header = ({ profile }: { profile: any }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
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
                <Button onClick={() => navigate("/login?view=sign_up")}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};