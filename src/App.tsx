import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { SignIn } from "@/components/auth/SignIn";
import { SignUp } from "@/components/auth/SignUp";
import { VerifyEmail } from "@/pages/VerifyEmail";
import Index from "@/pages/Index";
import { AboutUs } from "@/pages/AboutUs";
import { FAQ } from "@/pages/FAQ";
import { AccountSettings } from "@/pages/AccountSettings";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;