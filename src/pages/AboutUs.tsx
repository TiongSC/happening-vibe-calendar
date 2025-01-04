import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const AboutUs = () => {
  const { user } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header profile={profile} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">About Us</h1>
          
          <div className="prose prose-lg">
            <p className="mb-4">
              Welcome to our event planning platform! We're dedicated to making event organization 
              simple and efficient for everyone.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p className="mb-4">
              Our mission is to provide a seamless event management experience that brings people 
              together and makes organizing events a breeze.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Easy event creation and management</li>
              <li>Collaborative planning tools</li>
              <li>VIP features for premium users</li>
              <li>Intuitive calendar interface</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;