import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AboutUs = () => {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col">
      <Header profile={profile} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-primary mb-6">About Happening Vibe</h1>
          
          <div className="space-y-6 text-gray-600">
            <p>
              Welcome to Happening Vibe, your go-to platform for discovering and creating exciting events! 
              We're passionate about bringing people together and making every moment count.
            </p>
            
            <div className="bg-primary/5 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-primary mb-4">Our Mission</h2>
              <p>
                To create a vibrant community where people can easily connect, share, and participate in 
                events that matter to them. We believe in making event planning and discovery as seamless 
                and enjoyable as possible.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-secondary/5 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-secondary mb-3">For Event Creators</h3>
                <p>
                  We provide powerful tools to help you create, manage, and promote your events to reach 
                  the right audience.
                </p>
              </div>
              
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-primary mb-3">For Event Goers</h3>
                <p>
                  Discover exciting events in your area, connect with like-minded people, and never miss 
                  out on what's happening around you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;