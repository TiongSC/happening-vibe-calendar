import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthHeader } from "./AuthHeader";
import { UsernameInput } from "./UsernameInput";
import { AuthForm } from "./AuthForm";

export const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <AuthHeader />
      <UsernameInput username={username} onChange={setUsername} />
      <AuthForm view="sign_up" username={username} onUsernameChange={setUsername} />
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => navigate("/sign-in", { replace: true })}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};