import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthHeader } from "./auth/AuthHeader";
import { UsernameInput } from "./auth/UsernameInput";
import { Button } from "./ui/button";

export const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(location.search.includes("view=sign_up"));

  const handleToggleView = () => {
    const newSignUpState = !isSignUp;
    setIsSignUp(newSignUpState);
    navigate(newSignUpState ? "/login?view=sign_up" : "/login", { replace: true });
  };

  useEffect(() => {
    // Sync the state with the URL when the component mounts or location changes
    setIsSignUp(location.search.includes("view=sign_up"));
  }, [location]);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case "SIGNED_IN":
          if (session?.user) {
            if (!session.user.email_confirmed_at) {
              handleEmailNotConfirmed(session.user.email!);
            } else {
              if (isSignUp && username) {
                const { error: profileError } = await supabase
                  .from("profiles")
                  .update({ username })
                  .eq("id", session.user.id);

                if (profileError) {
                  toast({
                    title: "Error",
                    description: "Failed to set username. Please try again in account settings.",
                    variant: "destructive",
                    duration: 3000,
                  });
                }
              }
              toast({
                title: "Welcome!",
                description: "You have successfully signed in.",
                duration: 3000,
              });
              navigate("/", { replace: true });
            }
          }
          break;

        case "SIGNED_OUT":
          toast({
            title: "Signed Out",
            description: "You have been successfully signed out.",
            duration: 3000,
          });
          break;

        case "USER_UPDATED":
          toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
            duration: 3000,
          });
          break;

        default:
          break;
      }
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [navigate, toast, username, isSignUp]);

  const handleEmailNotConfirmed = async (email: string) => {
    try {
      setIsResendingVerification(true);
      const { error } = await supabase.auth.resend({ type: "signup", email });

      if (error) {
        toast({
          title: "Verification Error",
          description: error.message || "Unable to send verification email. Please try again later.",
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Verification Email Sent",
          description: "Please check your email to verify your account.",
          duration: 3000,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <AuthHeader />
      {isSignUp && <UsernameInput username={username} onChange={setUsername} />}
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
        view={isSignUp ? "sign_up" : "sign_in"}
      />
      <Button variant="link" className="mt-4 w-full" onClick={handleToggleView}>
        {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
      </Button>
    </div>
  );
};
