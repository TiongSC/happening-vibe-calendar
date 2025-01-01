import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export const AuthHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Welcome to Happening Vibe</h1>
      <Button variant="outline" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </div>
  );
};