import { Routes, Route } from "react-router-dom";
import { VerifyEmail } from "@/pages/VerifyEmail";
import { SetUsername } from "@/pages/SetUsername";
import Index from "@/pages/Index";
import AboutUs from "@/pages/AboutUs";
import FAQ from "@/pages/FAQ";
import AccountSettings from "@/pages/AccountSettings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignIn } from "@/pages/auth/SignIn";
import { SignUp } from "@/pages/auth/SignUp";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";

const queryClient = new QueryClient();

export function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/set-username" element={<SetUsername />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/account-settings" element={<AccountSettings />} />
      </Routes>
    </QueryClientProvider>
  );
}