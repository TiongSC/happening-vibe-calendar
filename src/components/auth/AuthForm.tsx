import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthResponse, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
      if (event === "SIGNED_OUT") {
        navigate("/sign-in");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response: AuthResponse;

      if (mode === "sign-in") {
        response = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        response = await supabase.auth.signUp({
          email,
          password,
        });
      }

      if (response.error) {
        toast({
          title: "Error",
          description: response.error.message,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Success",
          description: mode === "sign-in" ? "Signed in successfully" : "Account created successfully",
          duration: 3000,
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loading..." : mode === "sign-in" ? "Sign In" : "Sign Up"}
      </Button>
    </form>
  );
};