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
                What is Happening Vibe?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Happening Vibe is a dynamic event management platform that helps you create, organize, 
                and share events with your community. Whether you're planning a small gathering or a 
                large event, our platform makes it easy to manage everything in one place.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                What's the difference between regular and VIP users?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Regular users can create up to 2 events per day, while VIP users enjoy unlimited event 
                creation. VIP events are also highlighted in the calendar, making them more visible to 
                other users. Contact us to learn more about becoming a VIP user.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                How do I create an event?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                To create an event, simply sign in to your account and click the "Create Event" button. 
                Fill in the event details including title, description, date, and time. Make sure to 
                stay within your daily event creation limit if you're a regular user.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                Can I edit or delete my events?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes, you can edit or delete events that you've created at any time. Simply find your 
                event in the calendar and use the provided options. Admin users have the ability to 
                manage all events on the platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                How do I view events on a specific date?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Navigate to the calendar view and click on any date to see all events scheduled for 
                that day. VIP events will be highlighted for easy identification. You can view event 
                details by clicking on specific events.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-semibold">
                What happens if I reach my daily event creation limit?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Regular users are limited to creating 2 events per day. Once you reach this limit, 
                you'll need to wait until the next day to create more events, or consider upgrading 
                to a VIP account for unlimited event creation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-semibold">
                How do I contact support?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                You can reach our support team through our Facebook page at 
                facebook.com/happeningvibe.HV. We're always happy to help with any questions or 
                concerns you may have about using the platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-semibold">
                Is my account information secure?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes, we take security seriously. Your account information is encrypted and protected 
                using industry-standard security measures. We never share your personal information 
                with third parties without your consent.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-semibold">
                Can I use Happening Vibe on mobile devices?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes, Happening Vibe is fully responsive and works on all modern devices including 
                smartphones and tablets. You can access all features through your mobile browser 
                without needing to install any additional apps.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger className="text-lg font-semibold">
                How do I update my account settings?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                To update your account settings, click on the user icon in the footer to access your 
                Account Settings page. Here you can modify your profile information, notification 
                preferences, and other account-related settings.
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