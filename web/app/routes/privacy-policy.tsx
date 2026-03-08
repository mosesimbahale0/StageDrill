import React, { Fragment } from "react";
import { Transition } from "@headlessui/react";
import Navbar from "~/components/common/Navbar";
import Footer from "~/components/common/Footer";

// --- METADATA ---
export const meta = () => {
    return [
        { title: "Privacy Policy | WateRefil" },
        {
            name: "description",
            content: "Learn how WateRefil collects, uses, and protects your personal data to provide our water delivery service.",
        },
    ];
};

// --- PAGE SECTION COMPONENTS ---

/**
 * The Hero section for the Privacy Policy page.
 */
const PrivacyHeroSection = () => (
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
                        Privacy Policy
                    </h1>
                    <p className="mt-4 text-lg text-text2 max-w-3xl mx-auto">
                        Your trust is important to us. Here’s how we protect your privacy and handle your data.
                    </p>
                    <p className="mt-2 text-sm text-text2">
                        <strong>Effective Date:</strong> September 23, 2025
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
        { id: "introduction", title: "Introduction" },
        { id: "information-we-collect", title: "Information We Collect" },
        { id: "how-we-use-information", title: "How We Use Your Information" },
        { id: "how-we-share-information", title: "How We Share Your Information" },
        { id: "data-security", title: "Data Security" },
        { id: "your-rights", title: "Your Rights and Choices" },
        { id: "changes-to-policy", title: "Changes to This Policy" },
        { id: "contact-us", title: "Contact Us" },
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

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-primary text-text font-sans">
            <Navbar />
            <PrivacyHeroSection />

            <section className="py-24 bg-primary">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-16">
                    <aside className="hidden lg:block lg:col-span-1">
                        <TableOfContents />
                    </aside>

                    <main className="lg:col-span-3">
                        <PolicySection id="introduction" title="1. Introduction">
                            <p>
                                Welcome to WateRefil ("we," "our," "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, our "Services"). Please read this policy carefully. By using our Services, you agree to the terms of this Privacy Policy.
                            </p>
                        </PolicySection>

                        <PolicySection id="information-we-collect" title="2. Information We Collect">
                            <p>To provide our services effectively, we collect the following information:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Phone Number:</strong> When you create an account, we collect your phone number for authentication and communication purposes related to your orders.</li>
                                <li><strong>Location Data:</strong> We collect your delivery address, which you provide by pinning your location on the map, to ensure your water is delivered to the correct address.</li>
                            </ul>
                        </PolicySection>

                        <PolicySection id="how-we-use-information" title="3. How We Use Your Information">
                            <p>We use the information we collect solely for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To create and manage your WateRefil account.</li>
                                <li>To process and deliver your water refill orders.</li>
                                <li>To communicate with you about your order status, including confirmations and delivery updates.</li>
                                <li>To provide customer support and respond to your inquiries.</li>
                                <li>To improve our service, such as optimizing delivery routes.</li>
                                <li>To comply with legal obligations and enforce our terms and conditions.</li>
                            </ul>
                        </PolicySection>

                        <PolicySection id="how-we-share-information" title="4. How We Share Your Information">
                            <p>We do not sell your personal data. We may share your information in the following limited circumstances:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>With Delivery Personnel:</strong> We share your pinned location/delivery address with our delivery team for the sole purpose of fulfilling your order.</li>
                                <li><strong>With Service Providers:</strong> We may use third-party vendors for services like cloud hosting (e.g., Google Cloud, AWS). These providers are contractually obligated to protect your data and are prohibited from using it for other purposes.</li>
                                <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to a valid legal request.</li>
                            </ul>
                        </PolicySection>

                        <PolicySection id="data-security" title="5. Data Security">
                            <p>
                                We implement appropriate technical and organizational security measures to protect your information from unauthorized access, use, or disclosure. This includes encryption of data in transit and at rest. However, no security system is impenetrable, and we cannot guarantee the absolute security of your information.
                            </p>
                        </PolicySection>

                        <PolicySection id="your-rights" title="6. Your Rights and Choices">
                            <p>You have certain rights regarding your personal information. These include the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access and update your information through your account settings.</li>
                                <li>Request the deletion of your account and associated data by contacting us.</li>
                            </ul>
                        </PolicySection>

                        <PolicySection id="changes-to-policy" title="7. Changes to This Policy">
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Effective Date" at the top. We encourage you to review this Privacy Policy periodically.
                            </p>
                        </PolicySection>

                        <PolicySection id="contact-us" title="8. Contact Us">
                            <p>
                                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                            </p>
                            <a href="mailto:privacy@waterefil.com" className="text-accent hover:underline text-xl font-semibold">privacy@waterefil.com</a>
                        </PolicySection>
                    </main>
                </div>
            </section>

            <Footer />
        </div>
    );
}
