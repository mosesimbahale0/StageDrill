import type { MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
    return [
        { title: "RehersalZone • Support" },
        {
            name: "description",
            content: "  The Home Of Rehearsals",
        },
    ];
};
import Navbar from "~/components/common/Navbar";
import Footer from "~/components/common/Footer";

import { Link } from "@remix-run/react";

import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";

import { motion, Variants } from "framer-motion";

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

const download = () => {
    return (
        <>
            <Navbar />

            <motion.div
                className="  min-h-screen  bg-primary  "
                initial="hidden"
                animate="visible"
                variants={staggerChildren}
            >
                {/*+++++++++++++++++++++++++++++++++++++ SECTION +++++++++++++++++++++++++++ */}
                <section className=" flex flex-col gap-2  container mx-auto">
                    <section className=" ">
                        <div className="   ">
                            <div className="w-full text-center pt-32   ">
                                <div className="flex flex-col gap-10 text-left ">
                                    <div className=" text-center pb-10">
                                        <motion.h1
                                            className="text-4xl lg:text-6xl font-extrabold text-text"
                                            style={sulphurPoint}
                                            variants={fadeInUp}
                                        >
                                            Meet The <span className="text-accent">Family</span>
                                        </motion.h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/**B-B-B-B-B-BBBBBBBBBBBBBBBBBBBBBBBB-B-B--B-B-B-B-B-B-B-B-B-B-B- */}
                    {/* <div className="flex items-center my-8 before:flex-1 before:border-t  before:border-black before:mt-0.5 after:flex-1 after:border-t after:border-black after:mt-0.5">
              <FaGlobe className="text-5xl text-text mx-4" />
            </div> */}

                    <section className=" flex flex-col lg:flex-row items-center justify-center pb-10">
                        <div className="  bg-secondary rounded-lg h-64 w-full lg:w-1/3 p-6">
                            <div className="flex flex-col gap-6 items-left justify-center text-left">
                                <div className="inline-flex m-2 gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 32 32"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M15.318 7.677a.6.6 0 0 1 .23-.046h11.948a14.21 14.21 0 0 0-11.95-6.505A14.21 14.21 0 0 0 3.588 7.648l4.29 7.43a7.675 7.675 0 0 1 7.44-7.4zM28.196 8.84h-8.58a7.67 7.67 0 0 1 3.606 6.506c0 1.32-.334 2.564-.92 3.65a.7.7 0 0 1-.074.208L16.255 29.55c7.526-.367 13.514-6.586 13.514-14.204c0-2.344-.57-4.555-1.574-6.506zm-12.65 14.182a7.67 7.67 0 0 1-6.532-3.646a.6.6 0 0 1-.15-.17L2.89 8.855a14.16 14.16 0 0 0-1.565 6.49c0 7.625 6 13.847 13.534 14.206l4.286-7.425a7.65 7.65 0 0 1-3.6.895zM9.08 15.347c0 1.788.723 3.4 1.894 4.573a6.44 6.44 0 0 0 4.573 1.895c1.788 0 3.4-.723 4.573-1.895s1.895-2.785 1.895-4.573s-.723-3.4-1.895-4.573a6.45 6.45 0 0 0-4.573-1.894c-1.788 0-3.4.723-4.573 1.894a6.45 6.45 0 0 0-1.894 4.573"
                                        />
                                    </svg>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M20.463 17.194a.1.1 0 0 0-.13 0a7 7 0 0 1-.87.354c-.968.355-1.903.549-2.903.549a8.15 8.15 0 0 1-5.097-1.774c-1.42-1.194-2.194-2.742-2.194-4.355c0-.355.097-.774.226-1.097c-2.42 2.097-2.87 5.742-.903 8.355a5.3 5.3 0 0 0 1.742 1.645c1.258.774 2.742 1.032 4.193.774c.226-.032.452-.097.646-.193l.096-.033a10.12 10.12 0 0 0 5.194-4.129c.097-.032.097-.096 0-.096"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M10.204 21.226c-.032-.032-.097-.032-.129-.097a6.6 6.6 0 0 1-1.742-1.677c-1.032-1.42-1.451-3.194-1.193-4.968s1.226-3.258 2.645-4.323c0 0 .032-.032.097-.032a3.6 3.6 0 0 1 .516-.323c.129-.096.258-.129.42-.225h.031c.258-.13.742-.323 1.258-.323c.743 0 1.42.323 1.904.774c-.032-.097-.097-.129-.13-.226c-.419-.677-1-1.548-2.354-2.258c-1.42-.742-2.968-.774-3.258-.774c-3.097 0-5.678 1.903-6.13 4.42c-.096.225-.096.451-.096.677c0 1.516.323 3 .968 4.355c1.548 3.322 4.774 5.42 8.226 5.742c.258.032.548.032.806.032h.032a2.5 2.5 0 0 1-.645-.194c-.42-.129-.839-.354-1.226-.58"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="m21.236 7.194l-.032-.097C19.56 3.967 16.043 2 12.043 2C7.656 2 3.88 4.903 2.559 8.871c-.032.129-.097.323-.13.452c.13-.226.323-.452.485-.678c.322-.322.645-.645 1-.903a7.44 7.44 0 0 1 4.258-1.355c.451 0 2 .032 3.451.807c1.452.774 2.13 1.677 2.549 2.419c.193.323.322.677.42 1c.031.226.096.452.128.677c.032.323.032.581.032.742v.097c0 .484-.258 1.194-.677 1.742l-.097.097c-.096.097-.129.129-.129.226c0 .129.097.258.258.419c1.033.742 3.097.677 3.194.645c.806 0 1.58-.226 2.322-.645c1.452-.806 2.323-2.355 2.323-4.032c.097-1.71-.452-2.839-.71-3.387"
                                        />
                                    </svg>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 32 32"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M11.807 9.776c.011 0 .005 0 0 0M8.109 7.927c.011 0 .005 0 0 0m22.12 2.854c-.667-1.604-2.021-3.333-3.079-3.885c.865 1.692 1.365 3.396 1.552 4.661l.005.027c-1.739-4.329-4.681-6.073-7.088-9.871c-.12-.192-.24-.385-.36-.588c-.063-.104-.115-.208-.172-.319a2.8 2.8 0 0 1-.224-.609c0-.02-.015-.036-.036-.041h-.031l-.005.005c-.005 0-.011.005-.011.005s0-.005.005-.011c-3.417 2-4.828 5.505-5.193 7.729a8.3 8.3 0 0 0-3.041.776a.396.396 0 0 0-.197.489a.387.387 0 0 0 .525.224a7.4 7.4 0 0 1 2.651-.687l.089-.011c.125-.005.255-.011.38-.011a7.7 7.7 0 0 1 2.203.307l.125.037c.12.036.235.077.355.12c.083.031.172.063.255.099c.068.025.136.057.203.083q.157.073.313.152l.14.067q.155.08.303.167q.094.054.187.115a7.8 7.8 0 0 1 2.683 2.776c-.817-.572-2.287-1.145-3.697-.895c5.52 2.76 4.036 12.265-3.615 11.905a6.6 6.6 0 0 1-2.448-.568l-.26-.124c-1.876-.969-3.423-2.803-3.615-5.027c0 0 .708-2.64 5.072-2.64c.475 0 1.824-1.319 1.849-1.699c-.011-.125-2.683-1.187-3.724-2.213c-.557-.547-.817-.812-1.052-1.011a4 4 0 0 0-.401-.301a7.1 7.1 0 0 1-.041-3.751c-1.579.719-2.803 1.855-3.693 2.855h-.009c-.609-.771-.563-3.313-.532-3.844c-.005-.036-.453.229-.511.271c-.536.385-1.041.813-1.5 1.287a13.5 13.5 0 0 0-1.437 1.719a13 13 0 0 0-2.057 4.645a18 18 0 0 0-.249 1.417a8 8 0 0 0-.052.359a10 10 0 0 0-.089.881L.7 15.9c-.009.172-.02.339-.031.511v.077c0 8.48 6.875 15.355 15.355 15.355c7.593 0 13.9-5.516 15.135-12.756c.027-.197.047-.395.068-.593c.307-2.631-.031-5.401-.995-7.713z"
                                        />
                                    </svg>
                                    <p className="text-2xl font-bold ">Web App</p>
                                </div>

                                <div className=" text-sm h-12">
                                    Access the app on any browser.
                                </div>

                                <div className=" flex justify-center">
                                    <Link
                                        to="/auth"
                                        className=" bg-accent hover:bg-complementary px-10 py-4 rounded-full text-buttontext group inline-flex"
                                    >
                                        Get started free{" "}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-2"
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
                                </div>
                            </div>
                        </div>
                    </section>

                    {/**B-B-B-B-B-BBBBBBBBBBBBBBBBBBBBBBBB-B-B--B-B-B-B-B-B-B-B-B-B-B- */}

                    {/**B-B-B-B-B-BBBBBBBBBBBBBBBBBBBBBBBB-B-B--B-B-B-B-B-B-B-B-B-B-B- */}
                    {/* <div className="flex items-center my-8 before:flex-1 before:border-t  before:border-black before:mt-0.5 after:flex-1 after:border-t after:border-black after:mt-0.5">
              <BsAndroid className="text-5xl text-text mx-4" />
            </div> */}

                    <section className=" flex flex-col lg:flex-row items-center justify-center pb-10">
                        <div className="  bg-secondary rounded-lg h-64 w-full lg:w-1/3 p-6">
                            <div className="flex flex-col gap-6 items-left justify-center text-left">
                                <div className="inline-flex m-2 gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M1 18q.225-2.675 1.638-4.925T6.4 9.5L4.55 6.3q-.15-.225-.075-.475T4.8 5.45q.2-.125.45-.05t.4.3L7.5 8.9Q9.65 8 12 8t4.5.9l1.85-3.2q.15-.225.4-.3t.45.05q.25.125.325.375t-.075.475L17.6 9.5q2.35 1.325 3.762 3.575T23 18zm6-2.75q.525 0 .888-.363T8.25 14t-.363-.888T7 12.75t-.888.363T5.75 14t.363.888t.887.362m10 0q.525 0 .888-.363T18.25 14t-.363-.888T17 12.75t-.888.363t-.362.887t.363.888t.887.362"
                                        />
                                    </svg>

                                    <p className="text-2xl font-bold ">Android App</p>
                                </div>

                                <div className=" text-sm h-12">Coming Soon</div>

                                <div className=" flex justify-center">
                                    <a
                                        href="/comingsoon"
                                        target="_blank"
                                        className="bg-accent hover:bg-gray-600 text-buttontext rounded-full flex items-center justify-around  px-10 py-3 text-sm "
                                    >
                                        <ArrowDownTrayIcon className=" inline-flex mr-2" />{" "}
                                        <span className=""> Coming Soon</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/**B-B-B-B-B-BBBBBBBBBBBBBBBBBBBBBBBB-B-B--B-B-B-B-B-B-B-B-B-B-B- */}

                    {/**B-B-B-B-B-BBBBBBBBBBBBBBBBBBBBBBBB-B-B--B-B-B-B-B-B-B-B-B-B-B- */}
                    {/* <div className="flex items-center my-8 before:flex-1 before:border-t  before:border-black before:mt-0.5 after:flex-1 after:border-t after:border-black after:mt-0.5">
              <BsApple className="text-5xl text-text mx-4" />
            </div> */}

                    <section className=" flex flex-col lg:flex-row items-center justify-center pb-10">
                        <div className="  bg-secondary rounded-lg h-64 w-full lg:w-1/3 p-6">
                            <div className="flex flex-col gap-6 items-left justify-center text-left">
                                <div className="inline-flex m-2 gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 11a1 1 0 1 0-2 0a1 1 0 0 0 2 0"
                                        />
                                    </svg>

                                    <p className="text-2xl font-bold ">iOS App</p>
                                </div>

                                <div className=" text-sm h-12">Coming Soon</div>

                                <div className=" flex justify-center">
                                    <a
                                        href="/comingsoon"
                                        target="_blank"
                                        className="bg-accent hover:bg-gray-600 text-buttontext rounded-full flex items-center justify-around  px-10 py-3 text-sm "
                                    >
                                        <ArrowDownTrayIcon className=" inline-flex mr-2" />{" "}
                                        <span className=""> Coming Soon</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/**B-B-B-B-B-BBBBBBBBBBBBBBBBBBBBBBBB-B-B--B-B-B-B-B-B-B-B-B-B-B- */}
                </section>

                {/*FOOTER */}
                <Footer />
            </motion.div>
        </>
    );
};

export default download;