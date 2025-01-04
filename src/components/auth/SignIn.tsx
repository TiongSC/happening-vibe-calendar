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

  // Handle auth state changes
  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      console.log("Auth state changed:", event, session);

      if (event === 'SIGNED_IN' && session?.user?.id) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            toast({
              title: "Error",
              description: "Failed to fetch user profile",
              variant: "destructive",
            });
            return;
          }

          if (!profile?.username) {
            console.log("No username found, redirecting to set-username...");
            navigate('/set-username');
          } else {
            console.log("Username found, redirecting to home...");
            navigate('/');
            toast({
              title: "Welcome back!",
              description: "Successfully signed in",
            });
          }
        } catch (error) {
          console.error("Error in auth change handler:", error);
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    return () => subscription.unsubscribe();
  }, [navigate, toast]);

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
          variant: "destructive",
        });
        return;
      }

      console.log("Sign in successful:", data);
      // Auth state change listener will handle navigation and success toast
      
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <AuthHeader mode="sign-in" />
      <AuthForm mode="sign-in" onSubmit={handleSignIn} />
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
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