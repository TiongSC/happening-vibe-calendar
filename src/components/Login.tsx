import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthChangeEvent } from "@supabase/supabase-js";

export const Login = () => {
  const { toast } = useToast();
  const [isResendingVerification, setIsResendingVerification] = useState(false);

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
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Verification Email Sent",
          description: "A new verification email has been sent to your email address.",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Unable to resend verification email.",
        variant: "destructive"
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      switch (event) {
        case 'USER_DELETED':
          toast({
            title: "Account Deleted",
            description: "Your account has been successfully deleted.",
          });
          break;
        case 'PASSWORD_RECOVERY':
          toast({
            title: "Password Recovery",
            description: "Please check your email for password reset instructions.",
          });
          break;
        case 'SIGNED_OUT':
          toast({
            title: "Signed Out",
            description: "You have been successfully signed out.",
          });
          break;
        case 'SIGNED_IN':
          if (!session?.user.email_confirmed_at) {
            handleEmailNotConfirmed(session.user.email!);
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome to Happening Vibe</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
      />
    </div>
  );
};