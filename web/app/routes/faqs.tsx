import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Navbar from "~/components/common/Navbar";
import Footer from "~/components/common/Footer";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { ChevronDoubleDownIcon } from "@heroicons/react/20/solid";

export const meta: MetaFunction = () => {
    return [
        { title: "StageDrill • FAQs" },
        {
            name: "description",
            content: "Frequently Asked Questions about StageDrill.",
        },
    ];
};

// Animation variants copied from the 'About' page for a consistent feel
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const staggerChildren: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// Consistent font style for headings
const sulphurPoint = { fontFamily: "Sulphur Point, sans-serif" };

// Improved and expanded FAQ data
const faqs = [
    {
        question: "What is StageDrill and how does it work?",
        answer:
            "StageDrill is your personal AI-powered communication coach. You can practice interviews, speeches, or presentations, and our advanced AI will provide you with detailed feedback on your delivery, pacing, use of filler words, and more. Simply choose a rehearsal type, start rehearsal, and receive actionable insights to boost your confidence.",
    },
    {
        question: "Is my data and my rehearsals private and secure?",
        answer:
            "Absolutely. We prioritize your privacy and security above all else. All of your rehearsal data is encrypted and stored securely. We will never share your personal information or rehearsals with third parties. You have full control over your data and can delete it at any time.",
    },
    {
        question: "What kind of feedback does the AI provide?",
        answer:
            "Our AI analyzes various aspects of your communication. You'll receive feedback on your speaking pace (words per minute), use of filler words (like 'um' or 'ah'), vocal tone, and overall clarity. The goal is to provide objective, data-driven insights that you can use to make tangible improvements.",
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "We currently accept all major credit cards and PayPal for purchasing credits. We use PayPal, a secure and trusted payment processor, to handle all transactions, ensuring your financial information is safe.",
    },
    {
        question: "Can I get a refund on purchased credits?",
        answer:
            "Due to the nature of digital credits, they are non-refundable once purchased. However, if you encounter any technical issues with your purchase or the use of your credits, please contact our support team, and we'll be happy to assist you.",
    },
    {
        question: "Do my purchased credits expire?",
        answer:
            "No, your credits never expire! You can use them whenever you need to prepare for an important event, whether it's next week or next year. They will remain in your account until you use them.",
    },
    {
        question: "How can I get in touch with customer support?",
        answer:
            "Our customer support team is ready to assist you. You can reach us via the 'Contact Us' form on our website or by emailing support@stagedrill.com. We aim to respond to all inquiries within 24 hours.",
    },
];

export default function FaqPage() {
    return (
        <>
            <Navbar />
            <div className="bg-primary">
                <motion.main
                    className="bg-primary text-text container mx-auto px-4 lg:px-0"
                    initial="hidden"
                    animate="visible"
                    variants={staggerChildren}
                >
                    {/* Header Section */}
                    <section className="pt-24 lg:pt-32 text-center">
                        <motion.h1
                            className="text-4xl lg:text-6xl font-extrabold text-text"
                            style={sulphurPoint}
                            variants={fadeInUp}
                        >
                            Frequently Asked <span className="text-accent">Questions</span>
                        </motion.h1>
                        <motion.p
                            className="text-text2 text-xs lg:max-w-3xl mx-auto mt-6"
                            variants={fadeInUp}
                        >
                            Have questions? We've got answers. Here are some of the most
                            common queries we receive. If you can't find what you're looking
                            for, feel free to reach out to our support team.
                        </motion.p>
                    </section>

                    {/* FAQ Accordion Section */}
                    <motion.section
                        className="py-16 lg:py-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerChildren}
                    >
                        <div className="mx-auto w-full max-w-3xl rounded-3xl bg-background shadow-lg">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={faq.question}
                                    className="w-full"
                                    variants={fadeInUp}
                                >
                                    <Disclosure
                                        as="div"
                                        className={`${index === 0 ? "rounded-t-3xl" : ""} ${index === faqs.length - 1 ? "rounded-b-3xl" : ""
                                            } overflow-hidden`}
                                    >
                                        {({ open }) => (
                                            <>
                                                <DisclosureButton className="flex w-full items-center justify-between gap-4 py-6 px-8 text-left text-xl font-extrabold text-text2 transition-colors duration-300 hover:bg-accent/10 hover:text-text focus:outline-none border-b border-primary">
                                                    <span style={sulphurPoint}>{faq.question}</span>
                                                    <ChevronDoubleDownIcon
                                                        className={`${open ? "rotate-180" : ""
                                                            } h-6 w-6 text-accent transition-transform duration-300`}
                                                    />
                                                </DisclosureButton>
                                                <AnimatePresence initial={false}>
                                                    {open && (
                                                        <motion.section
                                                            key="content"
                                                            initial="collapsed"
                                                            animate="open"
                                                            exit="collapsed"
                                                            variants={{
                                                                open: { opacity: 1, height: "auto" },
                                                                collapsed: { opacity: 0, height: 0 },
                                                            }}
                                                            transition={{
                                                                duration: 0.4,
                                                                ease: [0.04, 0.62, 0.23, 0.98],
                                                            }}
                                                        >
                                                            <DisclosurePanel
                                                                static
                                                                className="px-8 pb-6 pt-2 text-xs text-text2"
                                                            >
                                                                {faq.answer}
                                                            </DisclosurePanel>
                                                        </motion.section>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        )}
                                    </Disclosure>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Final CTA - Copied from About page for consistency */}
                    <motion.div
                        className="flex lg:flex-row flex-col gap-10 lg:h-14 justify-center lg:items-center py-32"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            variants={fadeInUp}
                        >
                            {/* Primary Button - Filled */}
                            <Link
                                to="/auth"
                                className="bg-accent hover:bg-complementary active:bg-accent px-8 h-14 rounded-2xl group inline-flex justify-center items-center gap-2 border-2 border-accent text-buttontext transition-colors duration-300 ease-in-out shadow-lg hover:shadow-accent/30"
                            >
                                Get started free
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 max-w-8 transition-transform duration-300 ease-in-out group-hover:translate-x-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.main>
            </div>
            <Footer />
        </>
    );
}