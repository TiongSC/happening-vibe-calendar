import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AuthError, AuthChangeEvent } from "@supabase/supabase-js";

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
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (event === 'USER_DELETED') {
        toast({
          title: "Account Deleted",
          description: "Your account has been successfully deleted.",
        });
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Recovery",
          description: "Please check your email for password reset instructions.",
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleAuthError = (error: AuthError) => {
    if (error.message.includes("User already registered")) {
      toast({
        title: "Account Exists",
        description: "This email is already registered. Please sign in instead.",
        variant: "destructive"
      });
    } else if (error.message.includes("Email not confirmed")) {
      const emailMatch = error.message.match(/for user with email "(.+)"/);
      const email = emailMatch ? emailMatch[1] : null;
      
      if (email) {
        toast({
          title: "Email Not Confirmed",
          description: "Please check your email to verify your account.",
          action: (
            <Button 
              size="sm" 
              onClick={() => handleEmailNotConfirmed(email)}
              disabled={isResendingVerification}
            >
              {isResendingVerification ? "Sending..." : "Resend Verification"}
            </Button>
          )
        });
      }
    } else {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome to Happening Vibe</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
        onError={handleAuthError}
      />
    </div>
  );
};