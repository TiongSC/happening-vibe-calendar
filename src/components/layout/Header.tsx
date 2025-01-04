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
    navigate("/sign-in");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/d53ff001-ab02-4d00-aad4-bfe845e43402.png"
              alt="Happening Vibe Logo"
              className="w-10 h-10 rounded"
            />
            <Button
              variant="link"
              className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent p-0"
              onClick={() => navigate("/")}
            >
              Happening Vibe
            </Button>
          </div>
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
                <Button 
                  variant="outline"
                  className="hover:bg-primary hover:text-white transition-colors"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  className="hover:bg-primary/10 transition-colors"
                  onClick={() => navigate("/sign-in")}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white transition-colors"
                  onClick={() => navigate("/sign-up")}
                >
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