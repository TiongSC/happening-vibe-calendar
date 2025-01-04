import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Email Verification Required</h1>
      <Alert className="mb-6">
        <AlertDescription>
          We've sent you a verification email. Please check your inbox and click the verification link to complete your registration.
          Once verified, you can sign in to your account.
        </AlertDescription>
      </Alert>
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => navigate("/sign-in")}
          className="w-full"
        >
          Return to Sign In
        </Button>
      </div>
    </div>
  );
};