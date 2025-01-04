import { AuthHeader } from "./AuthHeader";
import { AuthForm } from "./AuthForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthResponse } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const SignUp = () => {
  const navigate = useNavigate();
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate('/account-settings');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (email: string, password: string, username?: string) => {
    try {
      // First check if username exists
      if (username) {
        const { data: existingUsers, error: checkError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username);

        if (checkError) {
          toast({
            title: "Error",
            description: "Error checking username availability",
            variant: "destructive",
          });
          return;
        }

        if (existingUsers && existingUsers.length > 0) {
          toast({
            title: "Username Taken",
            description: "This username is already taken. Please choose another one.",
            variant: "destructive",
          });
          return;
        }
      }

      const { error, data }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        if (error.message.includes('over_email_send_rate_limit')) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Please wait 24 seconds before trying again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data.user) {
        setShowVerificationMessage(true);
        toast({
          title: "Verification Email Sent",
          description: "Please check your email and click the verification link to complete your registration.",
          duration: 6000,
        });
        navigate('/verify-email');
      }
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <AuthHeader mode="sign-up" />
      {showVerificationMessage ? (
        <Alert className="mb-4">
          <AlertDescription>
            A verification email has been sent to your email address. Please check your inbox and click the verification link to complete your registration.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <AuthForm mode="sign-up" onSubmit={handleSignUp} />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => navigate("/sign-in")}
              >
                Sign in
              </Button>
            </p>
          </div>
        </>
      )}
    </div>
  );
};