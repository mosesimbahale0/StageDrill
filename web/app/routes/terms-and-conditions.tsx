import React, { Fragment } from "react";
import { Transition } from "@headlessui/react";
import Navbar from "~/components/common/Navbar";
import Footer from "~/components/common/Footer";

// --- METADATA ---
export const meta = () => {
    return [
        { title: "Terms and Conditions | WateRefil" },
        {
            name: "description",
            content: "Read the Terms and Conditions for using the WateRefil water delivery service, application, and website.",
        },
    ];
};

// --- PAGE SECTION COMPONENTS ---

/**
 * The Hero section for the Terms and Conditions page.
 */
const TermsHeroSection = () => (
    <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 text-center">
            <Transition
                as={Fragment}
                appear={true}
                show={true}
                enter="transition-all ease-in-out duration-1000 transform"
                enterFrom="opacity-0 translate-y-10"
                enterTo="opacity-100 translate-y-0"
            >
                <div>
                    <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">
                        Terms and Conditions
                    </h1>
                    <p className="mt-4 text-lg text-text2 max-w-3xl mx-auto">
                        Please read these terms carefully before using our services.
                    </p>
                    <p className="mt-2 text-sm text-text2">
                        <strong>Last Updated:</strong> September 23, 2025
                    </p>
                </div>
            </Transition>
        </div>
    </section>
);

const PolicySection = ({ title, children, id }: { title: string, children: React.ReactNode, id: string }) => (
    <div id={id} className="mb-10 scroll-mt-24">
        <h2 className="text-3xl font-bold text-text mb-4 pb-2 border-b border-tertiary">{title}</h2>
        <div className="space-y-4 text-text2 text-lg leading-relaxed">
            {children}
        </div>
    </div>
);

const TableOfContents = () => {
    const sections = [
        { id: "acceptance", title: "1. Acceptance of Terms" },
        { id: "service-description", title: "2. Description of Service" },
        { id: "user-accounts", title: "3. User Accounts and Orders" },
        { id: "user-conduct", title: "4. User Conduct" },
        { id: "limitation-of-liability", title: "5. Limitation of Liability" },
        { id: "termination", title: "6. Termination" },
        { id: "governing-law", title: "7. Governing Law" },
        { id: "changes-to-terms", title: "8. Changes to Terms" },
        { id: "contact-us", title: "9. Contact Us" },
    ];

    return (
        <div className="sticky top-24">
            <h3 className="text-xl font-bold text-text1 mb-4">On this page</h3>
            <ul className="space-y-2">
                {sections.map(section => (
                    <li key={section.id}>
                        <a href={`#${section.id}`} className="text-text2 hover:text-accent transition-colors duration-200">
                            {section.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---

export default function TermsAndConditionsPage() {
    return (
        <div className="bg-primary text-text font-sans">
            <Navbar />
            <TermsHeroSection />

            <section className="py-24 bg-primary">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-16">
                    <aside className="hidden lg:block lg:col-span-1">
                        <TableOfContents />
                    </aside>

                    <main className="lg:col-span-3">
                        <PolicySection id="acceptance" title="1. Acceptance of Terms">
                            <p>
                                By creating an account, downloading our application, or using our website (collectively, the "Services"), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, do not use our Services.
                            </p>
                        </PolicySection>

                        <PolicySection id="service-description" title="2. Description of Service">
                            <p>
                                WateRefil provides an on-demand water delivery service. Through our platform, users can order purified water to be delivered to a location specified by them within our designated service areas.
                            </p>
                        </PolicySection>
                        
                        <PolicySection id="user-accounts" title="3. User Accounts and Orders">
                            <p>
                                You are responsible for maintaining the confidentiality of your account information and for all activity that occurs under your account. You must provide accurate and complete information, including your phone number and delivery location. All orders are subject to availability and our acceptance. Prices and delivery fees are specified at the time of order. Payment is due upon placing an order through the available payment methods.
                            </p>
                        </PolicySection>

                        <PolicySection id="user-conduct" title="4. User Conduct">
                            <p>You agree not to use the Services for any unlawful purpose or in any way that could harm, disable, or impair the Service. This includes, but is not limited to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Providing false, inaccurate, or misleading information for your account or delivery location.</li>
                                <li>Attempting to gain unauthorized access to our systems.</li>
                                <li>Interfering with any other party's use and enjoyment of the Services.</li>
                            </ul>
                        </PolicySection>

                        <PolicySection id="limitation-of-liability" title="5. Limitation of Liability">
                            <p>
                                To the fullest extent permitted by law, WateRefil and its affiliates, officers, employees, and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Services. We are not responsible for delays in delivery due to circumstances beyond our reasonable control (e.g., traffic, weather). Our liability is limited to the purchase price of the product you purchased.
                            </p>
                        </PolicySection>

                        <PolicySection id="termination" title="6. Termination">
                            <p>
                                We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason, including if you breach these Terms. You may delete your account at any time through the application settings.
                            </p>
                        </PolicySection>

                        <PolicySection id="governing-law" title="7. Governing Law">
                            <p>
                                These Terms shall be governed and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
                            </p>
                        </PolicySection>

                        <PolicySection id="changes-to-terms" title="8. Changes to Terms">
                            <p>
                                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                            </p>
                        </PolicySection>

                        <PolicySection id="contact-us" title="9. Contact Us">
                            <p>
                                If you have any questions about these Terms, please contact us at:
                            </p>
                            <a href="mailto:support@waterefil.com" className="text-accent hover:underline text-xl font-semibold">support@waterefil.com</a>
                        </PolicySection>
                    </main>
                </div>
            </section>

            <Footer />
        </div>
    );
}
