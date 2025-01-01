import { useState } from "react";
import { AuthHeader } from "./AuthHeader";
import { UsernameInput } from "./UsernameInput";
import { AuthForm } from "./AuthForm";

export const SignUp = () => {
  const [username, setUsername] = useState("");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <AuthHeader />
      <UsernameInput username={username} onChange={setUsername} />
      <AuthForm view="sign_up" username={username} onUsernameChange={setUsername} />
    </div>
  );
};