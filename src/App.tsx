import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;