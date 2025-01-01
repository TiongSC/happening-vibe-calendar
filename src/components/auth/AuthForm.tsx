import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export interface AuthFormProps {
  view: "sign_in" | "sign_up";
}

export const AuthForm = ({ view }: AuthFormProps) => {
  return (
    <Auth
      supabaseClient={supabase}
      view={view}
      appearance={{
        theme: ThemeSupa,
        style: {
          button: {
            background: "rgb(59 130 246)",
            color: "white",
            '&:hover': {
              background: "rgb(29 78 216)",
            } as any,
          },
        },
      }}
      theme="light"
      showLinks={false}
    />
  );
};