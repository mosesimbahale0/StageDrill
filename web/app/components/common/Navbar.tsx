// File path: src/components/Navbar.js
import { Link, NavLink } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import {
  Popover,
  Transition,
  PopoverButton,
  PopoverPanel,
  PopoverGroup,
} from "@headlessui/react";

import ThemeToggle from "~/components/theme/ThemeToggle";
import Logo from "./Logo";

// Auth
//--------------------------------------------------------------------------
import { useAuth } from "~/authContext";
// -----------------------------------------------------------------------------

const solutions = [
  {
    name: "About",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "/about",
  },

  {
    name: "Blog",
    description: "Your customers' data will be safe and secure.",
    href: "/articles",
  },
  {
    name: "Pricing",
    description: "Speak directly to your customers in a more meaningful way.",
    href: "/pricing",
  },
  {
    name: "FAQs",
    description: "Connect with third-party tools that you're already using.",
    href: "/faqs",
  },
  // {
  //   name: "T & C s",
  //   description: "Connect with third-party tools that you're already using.",
  //   href: "/terms-of-service",
  // },
  {
    name: "Support",
    description: "Connect with third-party tools that you're already using.",
    href: "/support",
  },
  {
    name: "Apps",
    description: "Connect with third-party tools that you're already using.",
    href: "/apps",
  },
];

export default function Example() {
  const { user, loading } = useAuth();

  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowShadow(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeClassName = "text-text p-1 border-b-2 border-accent text-sm";

  return (
    <div>
      <Popover
        className={`fixed top-0 left-0 right-0 h-16 flex justify-center items-center z-20 transition-all duration-300 transform ${
          showShadow
            ? "shadow-sm shadow-black/30 bg-primary backdrop-blur-sm"
            : "shadow-none"
        }`}
      >
        <div className="container mx-auto flex flex-row justify-between items-center px-4 lg:px-0">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <PopoverButton className="rounded-lg bg-accent p-2 text-text hover:bg-primary hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent">
              <span className="sr-only">Open menu</span>
              {/* Inline SVG for Menu Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              </svg>
            </PopoverButton>
          </div>

          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <PopoverGroup as="nav" className="hidden lg:flex gap-10 ">
            {solutions.map(({ name, href }) => (
              <NavLink
                key={name}
                to={href}
                className={({ isActive }) =>
                  isActive
                    ? activeClassName
                    : "text-textbutton hover:text-accent p-1 text-sm font-normal"
                }
              >
                {name}
              </NavLink>
            ))}
          </PopoverGroup>

          {/* <a
            href="https://docs.google.com/document/d/1Y8cRid9Nf5QnWll2-3ceofHnXwI0oJQtD8Z-Yck9Ecg/edit?usp=sharing"
            target="_blank"
            className="hidden sm:flex  flex-row items-center gap-2 bg-primary hover:bg-accent hover:text-text text-text2  px-4   rounded-2xl justify-center h-12  text-sm "
          >
            CV
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7h10v10M7 17L17 7"
              />
            </svg>
          </a> */}

          <div className=" flex flex-row gap-2 h-full justify-center items-center">
            <ThemeToggle />

            {/* <Link to="/auth" className="hidden sm:flex  flex-row items-center gap-2 bg-accent t  hover:bg-complementary  px-8  justify-center h-12  text-sm  rounded-2xl ">
              Sign In
            </Link> */}

            {/* IF USER IS LOGGED IN SHOW USERNAME */}
            {/*       <p>Username: {user?.displayName}</p> */}

            {user ? (
              <div className="hidden lg:flex flex-row items-center gap-4">
                <Link
                  to="/account"
                  className=" bg-accent rounded-full hover:bg-complementary px-2.5 h-12 justify-center items-center   group inline-flex text-sm gap-2  text-buttontext"
                >
                  {" "}
                  <div className="h-8 w-8 rounded-full  flex items-center justify-center text-xl bg-buttontext hover:text-complementary text-complementary">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                  <div className=" max-w-40 text-buttontext">
                    <p className="truncate ...">{user.displayName} </p>
                  </div>
                </Link>
              </div>
            ) : (
              <>
                <section className="hidden lg:flex flex-row gap-2 ">
                  <Link
                    to="/auth"
                    className="bg-primary hover:bg-accent text-text hover:text-buttontext px-8 h-12 justify-center items-center rounded-2xl group inline-flex text-sm border-2 border-accent"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/auth"
                    className="bg-accent hover:bg-complementary text-buttontext px-8 h-12 justify-center items-center rounded-2xl group inline-flex text-sm border-2 border-accent"
                  >
                    Get Started Free
                  </Link>
                </section>
              </>
            )}

            {/* User Initials for small screen devices and icon for not authenticated user */}

            <Link to="/auth" className="lg:hidden">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-accent hover:bg-complementary flex items-center justify-center text-xl text-text">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-accent hover:bg-complementary flex items-center justify-center text-xl text-text">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <InfoPopover />
            </div>
          </div> */}
        </div>

        {/* Mobile Menu */}
        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <PopoverPanel className="absolute inset-x-0 top-0 p-4 bg-primary shadow-lg lg:hidden">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2  ">
                <section className="flex flex-row items-center gap-2 relative lg:w-64 w-auto">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="block h-10 w-auto"
                  />

                  <p
                    className="text-xl lg:text-3xl  font-extrabold "
                    style={{ fontFamily: "Sulphur Point" }}
                  >
                    RehearsalZone
                  </p>

                  <div className="text-text text-[10px] absolute top-0 right-0">
                    TM
                  </div>
                </section>
              </Link>
              <PopoverButton className="bg-accent p-2 rounded-lg text-white hover:bg-primary hover:text-accent">
                <span className="sr-only">Close menu</span>
                {/* Inline SVG for Close Icon */}x
              </PopoverButton>
            </div>
            <div className="mt-4">
              <nav className="grid gap-4">
                {solutions.map(({ name, href }) => (
                  <Link
                    key={name}
                    to={href}
                    className="block text-text hover:text-accent p-2 rounded-md"
                  >
                    {name}
                  </Link>
                ))}
              </nav>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  );
}
