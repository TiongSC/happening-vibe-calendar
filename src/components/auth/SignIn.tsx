import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthHeader } from "./AuthHeader";
import { AuthForm } from "./AuthForm";

export const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <AuthHeader />
      <AuthForm view="sign_in" />
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => navigate("/sign-up", { replace: true })}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};