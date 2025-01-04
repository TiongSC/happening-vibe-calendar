import { AuthHeader } from "./AuthHeader";
import { AuthForm } from "./AuthForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

export const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in successfully, checking profile...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session?.user?.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast({
            title: "Error",
            description: "Failed to fetch user profile",
            duration: 5000,
            variant: "destructive",
          });
          return;
        }

        console.log("Profile data:", profile);

        if (!profile?.username) {
          console.log("No username found, redirecting to set-username...");
          navigate('/set-username');
        } else {
          console.log("Username found, redirecting to home...");
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Sign In Error",
          description: error.message,
          duration: 5000,
          variant: "destructive",
        });
        return;
      }

      console.log("Sign in response:", data);
      
      if (data.user) {
        console.log("Sign in successful for user:", data.user.id);
        toast({
          title: "Success",
          description: "Signed in successfully",
          duration: 3000,
        });
      }

    } catch (error) {
      console.error("Unexpected error during sign in:", error);
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