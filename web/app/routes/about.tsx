import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Navbar from "~/components/common/Navbar";
import Footer from "~/components/common/Footer";
import { motion, Variants } from "framer-motion";

export const meta: MetaFunction = () => {
    return [
        { title: "StageDrill • About" },
        {
            name: "description",
            content: "StageDrill",
        },
    ];
};

// Animation variants for a consistent feel
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

export default function About() {
    return (
        <>
            <Navbar />
            <div className="bg-primary py-24">
                <motion.main
                    className="bg-primary text-text container mx-auto px-4 lg:px-0"
                    initial="hidden"
                    animate="visible"
                    variants={staggerChildren}
                >
                    {/* Header Section */}
                    <section className="pt-24 lg:pt-32">
                        <div className="flex flex-col gap-6 text-left">
                            <motion.h1
                                className="text-4xl lg:text-6xl font-extrabold text-text"
                                style={sulphurPoint}
                                variants={fadeInUp}
                            >
                                About <span className="text-accent">StageDrill</span>
                            </motion.h1>
                            <motion.p
                                className="text-text2 text-sm lg:max-w-6xl text-left"
                                variants={fadeInUp}
                            >
                                At StageDrill, we believe that preparation is the
                                secret behind every successful interview, speech, and
                                presentation. By combining proven communication strategies with
                                cutting-edge artificial intelligence, we empower you to refine
                                your delivery, boost your confidence, and turn every opportunity
                                into a triumph. Whether you’re a job-seeker facing a critical
                                interview, a speaker preparing for a keynote, or a professional
                                polishing your next slide deck, our platform is designed to be
                                your personal coach—anytime, anywhere.
                            </motion.p>
                        </div>
                    </section>

                    {/* Mission Section */}
                    <motion.section
                        className="py-16 lg:py-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerChildren}
                    >
                        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
                            <motion.div
                                className="flex flex-col gap-4 w-full lg:w-1/2"
                                variants={fadeInUp}
                            >
                                <h2
                                    className="text-3xl lg:text-4xl font-bold"
                                    style={sulphurPoint}
                                >
                                    Our Mission
                                </h2>
                                <p className="text-text2 text-sm">
                                    Our mission is to combine proven communication strategies with
                                    cutting-edge AI technology and empower users to refine
                                    delivery and boost confidence and to transform opportunities
                                    into triumphs through practice.
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-text2 text-sm">
                                    <li className="leading-relaxed">
                                        Serve multiple audiences:
                                        <ul className="list-circle pl-6 mt-2 space-y-1.5 text-sm">
                                            <li>Job-seekers preparing for critical interviews</li>
                                            <li>Speakers crafting keynotes</li>
                                            <li>Professionals polishing presentations</li>
                                        </ul>
                                    </li>
                                    <li className="leading-relaxed text-sm">
                                        Platform features:
                                        <ul className="list-circle pl-6 mt-2 space-y-1.5 text-sm">
                                            <li>
                                                Available 24/7 as your personal coaching assistant
                                            </li>
                                            <li>Accessible from anywhere with internet connection</li>
                                            <li>Personalized feedback and improvement tracking</li>
                                        </ul>
                                    </li>
                                </ul>
                            </motion.div>
                            <motion.div className="w-full lg:w-1/2" variants={fadeInUp}>
                                <img
                                    src="https://res.cloudinary.com/dlw9hjlzv/image/upload/v1754056424/RehearsalZoene/Group_2585_ffwhoa.png"
                                    alt="Our Mission Illustration"
                                    className="w-full h-full object-cover rounded-3xl"
                                />
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* Meet the Team Section */}
                    {/* <motion.section
            className="py-16 lg:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <div className="text-center mb-16">
              <motion.h2
                className="text-3xl lg:text-4xl font-bold"
                style={sulphurPoint}
                variants={fadeInUp}
              >
                Meet the Team
              </motion.h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <motion.div
                className="flex flex-col items-center gap-4"
                variants={fadeInUp}
              >
                <img
                  src="/assets/Gemini_Generated_Image_q73ayuq73ayuq73a.png"
                  alt="Team member John M. Doe"
                  className="w-40 h-40 object-cover rounded-full shadow-lg"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold" style={sulphurPoint}>
                    Carlos R. Garcia
                  </h3>
                  <p className="text-sm text-accent font-medium">
                    Founder & CEO
                  </p>
                  <p className="text-sm text-text2 mt-2 max-w-xs mx-auto">
                    Former Fortune 500 interviewer turned AI enthusiast,
                    passionate about democratizing access to elite-level
                    coaching.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-4"
                variants={fadeInUp}
              >
                <img
                  src="/assets/Gemini_Generated_Image_q73ayuq73ayuq73a.png"
                  alt="Team member"
                  className="w-40 h-40 object-cover rounded-full shadow-lg"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold" style={sulphurPoint}>
                    Jane A. Smith
                  </h3>
                  <p className="text-sm text-accent font-medium">
                    Tech Lead 
                  </p>
                  <p className="text-sm text-text2 mt-2 max-w-xs mx-auto">
                    A machine learning expert dedicated to building ethical and
                    helpful AI that empowers human potential.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-4"
                variants={fadeInUp}
              >
                <img
                  src="/assets/Gemini_Generated_Image_q73ayuq73ayuq73a.png"
                  alt="Team member"
                  className="w-40 h-40 object-cover rounded-full shadow-lg"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold" style={sulphurPoint}>
                    Carlos R. Garcia
                  </h3>
                  <p className="text-sm text-accent font-medium">
                   Lead 
                  </p>
                  <p className="text-sm text-text2 mt-2 max-w-xs mx-auto">
                    Crafting intuitive and beautiful experiences that make
                    powerful technology feel simple and approachable.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section> */}

                    {/* Inspiration Section */}
                    <motion.section
                        className="py-16 lg:py-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerChildren}
                    >
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-3xl lg:text-4xl font-bold"
                                style={sulphurPoint}
                                variants={fadeInUp}
                            >
                                What Inspired This Project?
                            </motion.h2>
                        </div>
                        {/* Inspiration 1: Compassion */}
                        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 mb-20">
                            <motion.div className="w-full lg:w-1/2" variants={fadeInUp}>
                                <img
                                    src="https://res.cloudinary.com/dlw9hjlzv/image/upload/v1754056537/RehearsalZoene/Group_2586_typiin.png"
                                    alt="Compassion illustration"
                                    className="w-full h-full object-cover rounded-3xl"
                                />
                            </motion.div>
                            <motion.div
                                className="flex flex-col gap-4 w-full lg:w-1/2"
                                variants={fadeInUp}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-accent text-buttontext w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                                        1
                                    </div>
                                    <h3
                                        className="text-2xl lg:text-3xl font-semibold"
                                        style={sulphurPoint}
                                    >
                                        Compassion
                                    </h3>
                                </div>
                                <h4 className="text-lg font-semibold leading-normal text-text">
                                    We understand the{" "}
                                    <span className="text-warning">anxiety</span> and{" "}
                                    <span className="text-warning">pressure</span> that accompany
                                    high-stakes occasions.
                                </h4>
                                <p className="text-text2 text-sm">
                                    At the heart of "StageDrill" lies a deep-seated
                                    compassion for individuals striving to excel in crucial
                                    communication moments... This platform aims to democratize
                                    communication coaching, making the keys to success accessible
                                    to all.
                                </p>
                            </motion.div>
                        </div>
                        {/* Inspiration 2: Quote */}
                        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
                            <motion.div
                                className="flex flex-col gap-4 w-full lg:w-1/2"
                                variants={fadeInUp}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-accent text-buttontext w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                                        2
                                    </div>
                                    <h3
                                        className="text-2xl lg:text-3xl font-semibold"
                                        style={sulphurPoint}
                                    >
                                        A Quote to Live By
                                    </h3>
                                </div>
                                <h4 className="text-lg font-semibold leading-normal text-text">
                                    "If you can't explain it simply, you don't understand it well
                                    enough."
                                </h4>
                                <p className="text-text2 text-sm">
                                    Einstein's wisdom reminds us that true mastery comes from
                                    deliberate practice. By breaking down your performance into
                                    smaller, manageable steps and rehearsing them repeatedly,
                                    you'll not only improve your skills but also gain a deeper
                                    understanding of your craft.
                                </p>
                            </motion.div>
                            <motion.div className="w-full lg:w-1/2" variants={fadeInUp}>
                                <img
                                    src="https://res.cloudinary.com/dlw9hjlzv/image/upload/v1754056658/RehearsalZoene/Group_2587_zumguy.png"
                                    alt="Illustration for a quote"
                                    className="w-full h-full object-cover rounded-3xl"
                                />
                            </motion.div>
                        </div>
                        {/* Inspiration 3: Demystifying AI */}
                        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 mb-20">
                            <motion.div className="w-full lg:w-1/2" variants={fadeInUp}>
                                <img
                                    src="https://res.cloudinary.com/dlw9hjlzv/image/upload/v1754056239/RehearsalZoene/undraw_voice-control_qghj_df1apr.svg"
                                    alt="Demystifying AI illustration"
                                    className="w-full h-full object-cover rounded-3xl"
                                />
                            </motion.div>
                            <motion.div
                                className="flex flex-col gap-4 w-full lg:w-1/2"
                                variants={fadeInUp}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-accent text-buttontext w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                                        3
                                    </div>
                                    <h3
                                        className="text-2xl lg:text-3xl font-semibold"
                                        style={sulphurPoint}
                                    >
                                        Demystifying AI
                                    </h3>
                                </div>
                                <h4 className="text-lg font-semibold leading-normal text-text">
                                    AI: The Good, the Bad, and the Ugly
                                </h4>
                                <p className="text-text2 text-sm">
                                    Think of our AI as your personal rehearsal coach – always
                                    available, endlessly patient, and dedicated to helping you
                                    refine your delivery. We believe in making the benefits of AI
                                    accessible to everyone, empowering you to leverage this
                                    cutting-edge technology to master your next interview, speech,
                                    or presentation with confidence and ease.
                                </p>
                            </motion.div>
                        </div>
                        {/* Inspiration 4: R&D */}
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <motion.div
                                className="flex flex-col gap-4 w-full lg:w-1/2"
                                variants={fadeInUp}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-accent text-buttontext w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                                        4
                                    </div>
                                    <h3
                                        className="text-2xl lg:text-3xl font-semibold"
                                        style={sulphurPoint}
                                    >
                                        Research and Development
                                    </h3>
                                </div>
                                <h4 className="text-lg font-semibold leading-normal text-text">
                                    Article Review and Insights
                                </h4>
                                <p className="text-text2 text-sm">
                                    We studied{" "}
                                    <a
                                        href="https://journals.sagepub.com/doi/10.1177/1475725718819290"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:underline hover:text-complementary"
                                    >
                                        this article
                                    </a>{" "}
                                    which shines a light on statistics anxiety among students.
                                    This research became a catalyst for our mission, highlighting
                                    that the key to overcoming performance anxiety lies in the
                                    opportunity to rehearse, refine, and receive feedback—safely
                                    and repeatedly.
                                </p>
                            </motion.div>
                            <motion.div className="w-full lg:w-1/2" variants={fadeInUp}>
                                <img
                                    src="https://res.cloudinary.com/dlw9hjlzv/image/upload/v1754056766/RehearsalZoene/Group_2588_ce0pkz.png"
                                    alt="Research and Development illustration"
                                    className="w-full h-full object-cover rounded-3xl"
                                />
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* Final CTA */}
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

                            {/* Secondary Button - Outlined */}
                            <Link
                                to="/pricing"
                                className="bg-transparent hover:bg-accent/10 border-2 border-accent text-accent hover:bg-accent hover:text-buttontext px-8 h-14 rounded-2xl inline-flex justify-center items-center gap-2 transition-all duration-300 ease-in-out"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="m7.58 15.008l.53-.531zm0-5.477L7.05 9zm6.867 6.846l.53.531zm-5.494 0l-.53.531zm2.747 1.936v.75zm8.594-7.765l-.53-.531zm-5.355-9.02a.75.75 0 0 0 .572 1.386zM7.737 15.16a.75.75 0 1 0 1.06 1.062zm3.12-.991a.75.75 0 1 0-1.06-1.063zm1.362 4.049l.26.704zm-6.47-6.512l-.695-.28zm7.28-6.55a.75.75 0 1 0-1.058-1.063zm6.735 4.86l-5.847 5.829l1.06 1.062l5.846-5.83zm-10.281 5.83l-1.374-1.37L7.05 15.54l1.374 1.37zM17.547 2.75h.569v-1.5h-.57zm3.703 3.123v.567h1.5v-.567zM18.116 2.75c.936 0 1.564.002 2.031.064c.446.06.633.163.755.284l1.059-1.062c-.447-.446-1.003-.626-1.614-.708c-.59-.08-1.337-.078-2.231-.078zm4.634 3.123c0-.892.002-1.636-.078-2.225c-.082-.611-.264-1.166-.711-1.612L20.9 3.098c.122.121.225.307.285.75c.063.466.064 1.09.064 2.025zM8.11 14.477c-.663-.66-1.105-1.104-1.391-1.478c-.273-.356-.331-.56-.331-.73h-1.5c0 .632.265 1.152.64 1.642c.361.472.89.997 1.522 1.628zm.314 2.431c.632.63 1.159 1.158 1.632 1.518c.492.374 1.013.637 1.644.637v-1.5c-.173 0-.378-.059-.735-.33c-.375-.286-.82-.727-1.482-1.387zm12.4-5.83c.798-.795 1.354-1.332 1.647-2.036l-1.385-.575c-.151.364-.436.667-1.322 1.55zm.426-4.638c0 1.249-.013 1.663-.164 2.027l1.385.575c.292-.704.28-1.476.28-2.602zm-3.703-5.19c-1.13 0-1.903-.013-2.608.278l.572 1.386c.366-.15.784-.164 2.036-.164zm-8.75 14.973l2.06-2.053l-1.06-1.063l-2.06 2.054zm5.12-.377c-.511.51-.896.893-1.226 1.178c-.332.287-.556.426-.731.491l.518 1.408c.428-.158.814-.436 1.193-.764s.808-.755 1.305-1.25zm-1.957 1.669a.7.7 0 0 1-.26.048v1.5q.404-.001.778-.14zM7.05 9c-.485.484-.904.901-1.23 1.272c-.324.37-.6.745-.766 1.156l1.392.56c.07-.177.216-.4.502-.727c.285-.325.663-.702 1.161-1.2zm-1.996 2.428a2.2 2.2 0 0 0-.166.841h1.5c0-.09.016-.179.058-.282zm3.055-1.366l4.92-4.906l-1.058-1.062L7.05 9z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="m5.573 11.532l.53-.53V11zm4.347-4.11a.75.75 0 1 0 .811-1.261zm-.224-1.035l.406-.63zm-2.57-1.319l.11-.742zm-4.9 2.956l.529.53zm3.113-2.727l.288.692zm-2.476 4.13l-.276.697zm-.162.742a.75.75 0 0 0 .571-1.387zm-.217-.893l.277-.697zm2.735 2.962a.75.75 0 0 0 1.06-1.06zm.403-1.716a.75.75 0 1 0-1.059 1.062zm5.11-4.361l-.63-.405l-.812 1.261l.63.405zm-.63-.405c-.621-.4-1.123-.723-1.554-.956c-.442-.238-.855-.406-1.312-.474L7.017 5.81c.22.033.46.117.819.31c.368.2.814.485 1.454.897zM2.755 8.555a57 57 0 0 1 1.71-1.659c.27-.247.518-.46.73-.623c.223-.172.365-.256.432-.284l-.575-1.385c-.257.107-.527.291-.773.481c-.258.2-.54.442-.826.703c-.572.522-1.2 1.149-1.757 1.705zm4.481-4.229a4.13 4.13 0 0 0-2.184.278l.575 1.385a2.63 2.63 0 0 1 1.39-.179zM2.208 9.974l.379.15l.552-1.395l-.378-.15zm.379.15l.114.045l.571-1.387l-.133-.053zm-.891-2.631a1.514 1.514 0 0 0 .512 2.48l.553-1.394l-.007-.003l-.003-.008V8.56l.004-.005zm3.347 4.569l.176.176l1.06-1.06L6.105 11zm-.48-.478l.48.479L6.104 11l-.48-.48zM12.5 18.5l-.53.53l.035.034zm5.323-5.268a.75.75 0 0 0-1.259.815zm-.223 1.035l-.63.408zm1.322 2.562l.742-.11zm-2.964 4.887l-.53-.531zm2.735-3.105l-.692-.29zm-3.248 2.686a.75.75 0 1 0-1.393.555zm-2.917-1.774a.75.75 0 1 0 .989-1.128zm3.346 2.276l.53.532zm-3.125-4.11a.75.75 0 0 0-1.061 1.06zm3.815-3.642l.406.628l1.26-.816l-.407-.627zm-1.135 7.138l-.085.083l1.06 1.063l.084-.084zm1.541-6.51c.414.638.7 1.082.9 1.45c.194.357.278.596.31.814l1.484-.22c-.068-.457-.237-.87-.476-1.31c-.233-.43-.557-.93-.958-1.55zm-.482 7.572c.557-.556 1.186-1.183 1.71-1.753c.261-.285.505-.565.704-.822c.19-.246.376-.515.483-.772l-1.384-.578a2.3 2.3 0 0 1-.284.43a12 12 0 0 1-.625.728c-.497.541-1.1 1.143-1.663 1.705zm1.693-5.308c.067.456.007.934-.18 1.383l1.384.578c.29-.693.388-1.448.28-2.181zm-4.664 1.456l-.523-.459l-.989 1.128l.523.459zm1.828 2.873a.1.1 0 0 1 .028-.016l.022-.001l.024.012q.018.016.026.034l-1.393.555c.384.964 1.632 1.196 2.352.479zM13.03 17.97l-.281-.281l-1.061 1.06l.281.282zm.887-7.341a.75.75 0 1 0 1.06-1.063zm2.747-1.063a.75.75 0 0 0 1.059 1.063zm1.059-2.738a2.696 2.696 0 0 0-3.806 0l1.06 1.062a1.196 1.196 0 0 1 1.687 0zm-3.806 0a2.68 2.68 0 0 0 0 3.8l1.06-1.062a1.18 1.18 0 0 1 0-1.676zm3.806 3.8a2.68 2.68 0 0 0 0-3.8l-1.06 1.062a1.18 1.18 0 0 1 0 1.676z"
                                    />
                                </svg>
                                Power Up with $0.01/Credit
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.main>
            </div>
            <Footer />
        </>
    );
}