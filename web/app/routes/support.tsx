import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { LifeBuoy, Mail, Phone, ChevronDown } from "lucide-react";

// Import shared UI components
import Navbar from "~/components/common/Navbar";
import Footer from "~/components/common/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Bagein • Support " },
    {
      name: "description",
      content: "An Eco Friendly Assets didposal Platform  ",
    },
  ];
};

// --- Reusable FAQ Item Component ---
type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-tertiary pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 hover:bg-tertiary/20 px-2 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-text1">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-accent transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pt-3 px-2">
          <p className="text-text2">{answer}</p>
        </div>
      )}
    </div>
  );
};

// --- Main Support Page Component ---
export default function SupportPage() {
  return (
    <section className="w-full bg-primary">
      <main className="bg-primary text-text min-h-screen py-24 container mx-auto p-4">
        <Navbar />
        <div className="max-w-4xl mx-auto">
          {/* --- Header & Contact Cards --- */}
          <div className="bg-secondary rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div className="flex-shrink-0">
                <LifeBuoy className="h-24 w-24 text-accent" />
              </div>
              <div className="text-center md:text-left mt-6 md:mt-0">
                <h1 className="text-4xl font-bold text-text1">
                  How can we help?
                </h1>
                <p className="text-text2 mt-4 text-lg">
                  We're here to assist you with any questions or issues you
                  might have. Reach out to us, and we'll get back to you as soon
                  as possible.
                </p>
              </div>
            </div>

            {/* --- Contact Methods Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {/* Email Card */}
              <div className="bg-tertiary p-6 rounded-2xl flex items-start space-x-4">
                <Mail className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-text1">
                    Email Support
                  </h3>
                  <p className="text-text2 mt-1 mb-2">
                    Best for non-urgent requests.
                  </p>
                  <a
                    href="mailto:support@bagein.com"
                    className="text-accent hover:underline font-medium break-all"
                  >
                    support@bagein.com
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-tertiary p-6 rounded-2xl flex items-start space-x-4">
                <Phone className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-text1">
                    Phone Support
                  </h3>
                  <p className="text-text2 mt-1 mb-2">
                    Mon-Fri, 9:00 AM - 5:00 PM
                  </p>
                  <span className="text-accent font-medium">
                    +254 700 000 000
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- FAQ Section --- */}
          <div className="bg-secondary rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-text1 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <FaqItem
                question="How do I create an account?"
                answer="You can create an account by clicking the 'Login' or 'Sign Up' button in the top navigation bar. You can sign up using your phone number or Google account."
              />
              <FaqItem
                question="How do I list an item for auction?"
                answer="Once logged in, go to your 'My Account' page and click the 'Add New Listing' button. Fill out the product details, set a starting bid, and define the auction duration."
              />
              <FaqItem
                question="What are the fees for selling on Bagein?"
                answer="We charge a small commission fee only on successfully sold items. There are no fees for listing your products. Please refer to our 'Pricing' page for a detailed breakdown."
              />
              <FaqItem
                question="How does bidding work?"
                answer="You can place a bid on any active auction. If your bid is the highest when the auction timer ends, you win the item. You will be notified via SMS and email to complete the payment."
              />
              <FaqItem
                question="Is my payment information secure?"
                answer="Yes, all payments are processed through a secure, encrypted connection. We do not store your credit card or M-Pesa details on our servers."
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
}
