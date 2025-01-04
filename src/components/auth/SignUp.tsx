import { AuthHeader } from "./AuthHeader";
import { AuthForm } from "./AuthForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SignUp = () => {
  const navigate = useNavigate();
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_UP' || event === 'USER_CREATED') {
        setShowVerificationMessage(true);
      } else if (event === 'SIGNED_IN') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
          <AuthForm mode="sign-up" />
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