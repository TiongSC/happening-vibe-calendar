import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { AuthHeader } from "./auth/AuthHeader";
import { UsernameInput } from "./auth/UsernameInput";

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
      <AuthHeader />
      {isSignUp && (
        <UsernameInput username={username} onChange={setUsername} />
      )}
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
        view={isSignUp ? "sign_up" : "sign_in"}
        onChange={(event) => {
          if (event.view) {
            setIsSignUp(event.view === "sign_up");
          }
        }}
      />
    </div>
  );
};