import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface AuthFormProps {
  view: "sign_in" | "sign_up";
}

export const AuthForm = ({ view }: AuthFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session); // Debug log
      
      switch (event) {
        case "SIGNED_IN":
          if (session?.user) {
            toast({
              title: "Welcome!",
              description: "You have successfully signed in.",
              duration: 3000,
            });
            navigate("/", { replace: true });
          }
          break;

        case "SIGNED_OUT":
          toast({
            title: "Signed Out",
            description: "You have been successfully signed out.",
            duration: 3000,
          });
          break;

        case "PASSWORD_RECOVERY":
          toast({
            title: "Password Recovery",
            description: "Check your email for password reset instructions.",
            duration: 5000,
          });
          break;

        case "USER_UPDATED":
          toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
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
  }, [navigate, toast]);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ 
        theme: ThemeSupa,
        style: {
          button: { background: 'rgb(59 130 246)', color: 'white' },
          anchor: { color: 'rgb(59 130 246)' },
        }
      }}
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