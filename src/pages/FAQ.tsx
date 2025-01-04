import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
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
          <h1 className="text-4xl font-bold text-primary mb-6">
            Frequently Asked Questions
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  How do I create an event?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  To create an event, log in to your account and click the "Create Event" button. 
                  Fill in the event details including title, description, date, and time. Regular users 
                  can create up to 2 events per day, while VIP users enjoy additional privileges.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  What are the benefits of having a username?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  A username helps identify you on the platform and makes it easier for other users 
                  to find and recognize you. Once set, your username cannot be changed to maintain 
                  consistency and prevent confusion in the community.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  What's the difference between regular and VIP users?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  VIP users enjoy premium features such as unlimited event creation, priority support, 
                  and advanced event management tools. Regular users can still create events but are 
                  limited to 2 events per day.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  How does the daily event limit work?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Regular users can create up to 2 events per day. This limit resets at midnight 
                  (GMT+8). VIP users don't have this restriction and can create unlimited events.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  Can I edit or delete my events?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, you can edit or delete any event that you've created. Simply find your event 
                  in the calendar view and use the edit or delete options. Note that administrators 
                  can also manage all events on the platform.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  How do I upgrade to a VIP account?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  To upgrade to a VIP account, contact our support team. VIP status provides 
                  additional benefits like unlimited event creation, priority support, and 
                  exclusive features to enhance your event planning experience.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;