import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AuthChangeEvent } from "@supabase/supabase-js";

export const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailNotConfirmed = async (email: string) => {
    try {
      setIsResendingVerification(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        toast({
          title: "Verification Error",
          description: "Unable to send verification email. Please try again later.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Verification Email Sent",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      switch (event) {
        case "SIGNED_IN":
          if (session?.user) {
            if (!session.user.email_confirmed_at) {
              handleEmailNotConfirmed(session.user.email!);
            } else {
              if (isSignUp) {
                const { error: profileError } = await supabase
                  .from('profiles')
                  .update({ username })
                  .eq('id', session.user.id);

                if (profileError) {
                  toast({
                    title: "Error",
                    description: "Failed to set username. Please try again in account settings.",
                    variant: "destructive"
                  });
                }
              }
              toast({
                title: "Welcome!",
                description: "You have successfully signed in.",
              });
              navigate("/");
            }
          }
          break;
        case "SIGNED_OUT":
          toast({
            title: "Signed Out",
            description: "You have been successfully signed out.",
          });
          break;
        case "USER_UPDATED":
          toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
          });
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, username, isSignUp]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome to Happening Vibe</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
      {isSignUp && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
      )}
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
        onViewChange={(view) => {
          setIsSignUp(view === "sign_up");
        }}
      />
    </div>
  );
};