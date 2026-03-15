import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { LifeBuoy, Mail, ChevronDown } from "lucide-react";

// Import shared UI components
import Navbar from "~/components/common/Navbar";
import Footer from "~/components/common/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "StageDrill • Support" },
    {
      name: "description",
      content: "Get help and support for StageDrill.",
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
        className="w-full flex justify-between items-center text-left py-4 hover:bg-tertiary/20 px-4 rounded-none transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-bold text-text">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-accent transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pt-3 px-4">
          <p className="text-text2 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

// --- Main Support Page Component ---
export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-background relative overflow-hidden flex flex-col pt-24 pb-16 font-sans">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-info/20 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-accent/20 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen" />
        
        <div className="max-w-4xl mx-auto px-4 w-full z-10">
          {/* --- Header & Contact Cards --- */}
          <div className="bg-primary border border-tertiary rounded-none shadow-sm p-8 md:p-12 mb-8 mt-8">
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <LifeBuoy className="h-24 w-24 text-accent" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold text-text tracking-tight">
                  How can we help?
                </h1>
                <p className="text-text2 mt-4 text-lg leading-relaxed">
                  We're here to assist you with any questions or issues you
                  might have regarding your interview preparation. Reach out to us, and we'll get back to you as soon
                  as possible.
                </p>
              </div>
            </div>

            {/* --- Contact Methods Grid --- */}
            <div className="mt-10 max-w-md mx-auto md:mx-0 md:ml-auto">
              {/* Email Card (Only mode of support) */}
              <div className="bg-secondary border border-tertiary p-6 rounded-none flex items-start space-x-4">
                <Mail className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-text">
                    Email Support
                  </h3>
                  <p className="text-text2 mt-1 mb-3 text-sm">
                    Our primary support channel. We reply within 24 hours.
                  </p>
                  <a
                    href="mailto:support@stagedrill.com"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-complementary text-buttontext px-4 py-2 text-sm font-bold transition-colors"
                  >
                    support@stagedrill.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* --- FAQ Section --- */}
          <div className="bg-primary border border-tertiary rounded-none shadow-sm p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-extrabold text-text mb-8 text-center" style={{ fontFamily: "Sulphur Point, sans-serif" }}>
              Quick Answers
            </h2>
            <div className="space-y-2">
              <FaqItem
                question="How do I start a new practice session?"
                answer="Navigate to the Funspots page from your dashboard and select a scenario that matches your needs. Click 'Start Call' to begin."
              />
              <FaqItem
                question="How do credits work?"
                answer="Every time you start a new AI interview practice session, credits are deducted from your balance. You can buy more credits on the Pricing page."
              />
              <FaqItem
                question="Can I review past interviews?"
                answer="Yes, all your past interview transcripts and feedback are saved in your account dashboard under 'History'."
              />
              <FaqItem
                question="Is my audio recorded or stored?"
                answer="We process your audio in real-time to generate AI responses and transcripts, but we do not store the raw audio files after the session ends to protect your privacy."
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
