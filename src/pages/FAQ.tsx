import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
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
          <h1 className="text-4xl font-bold text-primary mb-6">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                How do I create an event?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                To create an event, sign in to your account and click the "Create Event" button. 
                Fill in the event details including title, description, date, and time. Regular users 
                can create up to 2 events per day, while VIP users have unlimited event creation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Can I edit or delete my events?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes, you can edit or delete events that you've created. Simply find your event and 
                use the edit or delete options. Admin users can manage all events on the platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                What are VIP benefits?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                VIP users enjoy premium features including unlimited event creation, special event 
                highlighting, and priority support.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                How do I become a VIP user?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Contact our support team through the Contact Us link to learn more about VIP 
                membership options and benefits.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;