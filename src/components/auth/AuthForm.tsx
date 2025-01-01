import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface AuthFormProps {
  view: "sign_in" | "sign_up";
  username?: string;
  onUsernameChange?: (value: string) => void;
}

export const AuthForm = ({ view, username, onUsernameChange }: AuthFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case "USER_UPDATED":
        case "SIGNED_IN":
          if (session?.user) {
            if (!session.user.email_confirmed_at) {
              handleEmailNotConfirmed(session.user.email!);
            } else {
              if (view === "sign_up" && username) {
                // Check if username already exists before proceeding with sign up
                const { data: existingUser } = await supabase
                  .from("profiles")
                  .select("username")
                  .eq("username", username)
                  .single();

                if (existingUser) {
                  toast({
                    title: "Username already taken",
                    description: "Please choose a different username.",
                    variant: "destructive",
                    duration: 3000,
                  });
                  // Sign out the user so they can try again
                  await supabase.auth.signOut();
                  return;
                }

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

        default:
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, username, view]);

  const handleEmailNotConfirmed = async (email: string) => {
    try {
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
    }
  };

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="light"
      providers={[]}
      view={view}
      localization={{
        variables: {
          sign_up: {
            email_label: "Email",
            password_label: "Password",
            email_input_placeholder: "Your email",
            password_input_placeholder: "Your password",
            button_label: "Sign up",
            loading_button_label: "Signing up ...",
            social_provider_text: "Sign in with {{provider}}",
            confirmation_text: "Check your email for the confirmation link"
          },
          sign_in: {
            email_label: "Email",
            password_label: "Password",
            email_input_placeholder: "Your email",
            password_input_placeholder: "Your password",
            button_label: "Sign in",
            loading_button_label: "Signing in ...",
            social_provider_text: "Sign in with {{provider}}"
          }
        }
      }}
    />
  );
};