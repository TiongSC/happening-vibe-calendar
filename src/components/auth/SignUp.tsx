import { AuthHeader } from "./AuthHeader";
import { AuthForm } from "./AuthForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <AuthHeader />
      <AuthForm view="sign_up" />
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
    </div>
  );
};