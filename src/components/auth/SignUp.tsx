import { AuthHeader } from "./AuthHeader";
import { AuthForm } from "./AuthForm";

export const SignUp = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <AuthHeader />
      <AuthForm view="sign_up" />
    </div>
  );
};