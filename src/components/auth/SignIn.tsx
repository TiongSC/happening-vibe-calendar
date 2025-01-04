import { AuthHeader } from "./AuthHeader";
import { AuthForm } from "./AuthForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

export const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Check if user has a username set
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session?.user?.id)
          .single();

        if (!profile?.username) {
          navigate('/set-username');
        } else {
          navigate('/');
        }
      } else if (event === 'USER_UPDATED') {
        // Handle email verification success
        if (session?.user.email_confirmed_at) {
          toast({
            title: "Email Verified",
            description: "Your email has been successfully verified. You can now sign in.",
            duration: 5000,
          });
        }
      }
    });

    // Check for email verification status from URL parameters
    const params = new URLSearchParams(window.location.search);
    if (params.get('error_description') === 'Email not confirmed') {
      toast({
        title: "Email Verification Required",
        description: "Please check your email and click the verification link before signing in.",
        duration: 6000,
        variant: "destructive",
      });
    }

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and verify your account before signing in. If you need a new verification email, please sign up again.",
            duration: 6000,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign In Error",
            description: error.message,
            duration: 5000,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message,
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <AuthHeader mode="sign-in" />
      <AuthForm mode="sign-in" onSubmit={handleSignIn} />
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account yet?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={() => navigate("/sign-up")}
          >
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
};