import { useLocation } from "react-router-dom";
import { SignIn } from "./auth/SignIn";
import { SignUp } from "./auth/SignUp";

export const Login = () => {
  const location = useLocation();
  const isSignUp = location.search.includes("view=sign_up");

  return isSignUp ? <SignUp /> : <SignIn />;
};