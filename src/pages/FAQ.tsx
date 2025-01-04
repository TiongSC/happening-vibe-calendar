import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">
            Frequently Asked Questions
          </h1>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create an event?</AccordionTrigger>
              <AccordionContent>
                To create an event, simply log in to your account and click the "Create Event" 
                button. Fill in the event details including title, description, date, and time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What are VIP events?</AccordionTrigger>
              <AccordionContent>
                VIP events are special events created by our premium users. They appear with a 
                crown icon and are given priority in the calendar view.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How many events can I create per day?</AccordionTrigger>
              <AccordionContent>
                Regular users can create up to 2 events per day. This limit resets daily. 
                Administrators have unlimited event creation capabilities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I edit or delete my events?</AccordionTrigger>
              <AccordionContent>
                Yes, you can edit or delete any event that you've created. Administrators can 
                also manage all events on the platform.
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