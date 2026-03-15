import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Navbar from "~/components/common/Navbar";
import Footer from "~/components/common/Footer";
import { motion } from "framer-motion";

export const meta: MetaFunction = () => {
    return [
        { title: "StageDrill • Premium Credits" },
        { name: "description", content: "Unlock premium features with affordable credits" },
    ];
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const pulseGlow = {
    initial: { opacity: 0.7, scale: 1 },
    animate: {
        opacity: [0.7, 1, 0.7],
        scale: [1, 1.05, 1],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
};

export default function Pricing() {
    const features = [
        "Unlimited AI-powered feedback",
        "Access to specialized interview scenarios",
        "Detailed transcript analysis",
        "Priority 24/7 technical support",
        "No expiration on purchased credits",
    ];

    const packages = [
        { name: "Basic", credits: 100, bonus: 0, price: "$1.00", popular: false, desc: "Perfect for a single try" },
        { name: "Starter", credits: 500, bonus: 50, price: "$5.00", popular: true, desc: "A few interview rounds" },
        { name: "Pro", credits: 2000, bonus: 300, price: "$20.00", popular: false, desc: "Heavy preparation" },
        { name: "Expert", credits: 5000, bonus: 1000, price: "$50.00", popular: false, desc: "Master your delivery" },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-24 pb-16 font-sans">

                {/* Decorative Background Elements */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-info/20 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen" />
                <div className="absolute top-40 right-10 w-80 h-80 bg-accent/20 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-success/20 rounded-full blur-[80px] -z-10 pointer-events-none mix-blend-screen" />

                <div className="max-w-6xl mx-auto px-4 w-full flex-grow flex flex-col items-center justify-center">

                    {/* Hero Header */}
                    <motion.div
                        className="text-center max-w-2xl mx-auto mb-16"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-tertiary mb-6 shadow-sm">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                            </span>
                            <span className="text-sm font-bold text-text2 uppercase tracking-wider">Pay As You Go</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-text tracking-tight mb-6">
                            Simple pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-complementary">serious prep.</span>
                        </h1>
                        <p className="text-xl text-text2 leading-relaxed">
                            No subscriptions, no hidden fees. Buy credits only when you need them to unlock your dream career.
                        </p>
                    </motion.div>

                    {/* Pricing Section */}
                    <div className="w-full flex flex-col items-center pb-8 mb-12 max-w-6xl mx-auto">
                        <motion.div
                            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            {packages.map((pkg, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    className={`relative aspect-square p-6 lg:p-8 border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-primary flex flex-col justify-between group rounded-none ${pkg.popular ? "border-accent shadow-accent/10 shadow-2xl" : "border-tertiary"
                                        }`}
                                >
                                    {pkg.popular && (
                                        <div className="absolute -top-3 inset-x-0 mx-auto w-max px-4 py-1 bg-accent text-buttontext text-xs font-bold uppercase tracking-widest shadow-sm rounded-none">
                                            Most Popular
                                        </div>
                                    )}
                                    
                                    <div>
                                        <h3 className="text-xl font-bold text-text mb-1">{pkg.name}</h3>
                                        <p className="text-sm text-text3 mb-4">{pkg.desc}</p>
                                        
                                        <div className="flex items-baseline gap-1 mb-2">
                                            <span className="text-4xl font-black text-text">{pkg.price}</span>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1">
                                            <span className="text-2xl font-bold text-accent">{pkg.credits + pkg.bonus} Credits</span>
                                            {pkg.bonus > 0 ? (
                                                <span className="text-sm font-medium text-success">Includes {pkg.bonus} bonus</span>
                                            ) : (
                                                <span className="text-sm font-medium text-transparent">No bonus</span>
                                            )}
                                        </div>
                                    </div>

                                    <Link to={`/checkout?amount=${pkg.credits}`} className="w-full mt-auto block">
                                        <button className={`w-full py-3.5 font-bold transition-all flex justify-center items-center gap-2 rounded-none ${pkg.popular
                                            ? "bg-accent hover:bg-complementary text-buttontext shadow-[0_0_15px_rgba(255,95,0,0.3)] hover:shadow-[0_0_25px_rgba(255,95,0,0.5)]"
                                            : "bg-secondary hover:bg-tertiary text-text border border-tertiary"
                                            }`}>
                                            Select Bundle
                                        </button>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="w-full mt-16 max-w-4xl mx-auto bg-primary border border-tertiary p-8 rounded-none shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
                            <div className="md:w-1/2">
                                <h3 className="text-2xl font-bold text-text mb-4">Every bundle includes</h3>
                                <p className="text-text2 mb-6 text-sm">No matter which package you choose, you get full access to our premium capabilities.</p>
                                <Link to="/account">
                                    <button className="py-3 px-6 bg-secondary hover:bg-tertiary text-text font-bold rounded-none active:scale-95 transition-all border border-tertiary inline-flex items-center justify-center gap-2 text-sm">
                                        Continue with Balance
                                    </button>
                                </Link>
                            </div>
                            <ul className="md:w-1/2 space-y-4">
                                {features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-none bg-success/10 flex items-center justify-center text-success">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                        <span className="text-text font-medium text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}