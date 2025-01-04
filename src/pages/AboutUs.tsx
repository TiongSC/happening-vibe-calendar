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
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Welcome to Happening Vibe</h2>
                <p className="text-gray-600 leading-relaxed">
                  We're dedicated to making event organization simple and efficient for everyone. 
                  Our platform brings together event planners and participants in a seamless, 
                  user-friendly environment.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our mission is to revolutionize the way people plan and manage events. We believe 
                  that bringing people together should be easy, enjoyable, and stress-free.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">What We Offer</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Event Creation</h3>
                    <p className="text-gray-600">Create and manage events with our intuitive interface</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">VIP Features</h3>
                    <p className="text-gray-600">Access premium features with our VIP membership</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Calendar Integration</h3>
                    <p className="text-gray-600">Seamlessly manage your event schedule</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">User Community</h3>
                    <p className="text-gray-600">Connect with other event organizers</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;