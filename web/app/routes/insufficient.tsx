import type { MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
  return [
    { title: "Bagein • Insufficient Funds" },
    {
      name: "description",
      content: "An Eco Friendly Assets didposal Platform  ",
    },
  ];
};

import { Link } from "react-router-dom";
import { BanknotesIcon } from "@heroicons/react/24/outline";

import {
  useNavigate, // Import useNavigate
} from "@remix-run/react";

import Logo from "~/components/common/Logo";

export default function unauthorized() {
  const navigate = useNavigate(); // Add navigate hook
  return (
    <>
      <div className="w-full min-h-screen bg-primary flex flex-col gap-8 items-center justify-center  lg:p-8 ">
        <div className="  flex flex-row  gap-4 justify-center items-center ">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-20 h-20 rounded-full text-text1 bg-secondary hover:bg-tertiary transition-colors"
            aria-label="Go back"
          >
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
                d="m15 18l-6-6l6-6"
              ></path>
            </svg>
          </button>

          <div className="  flex flex-row  gap-2 justify-center items-center outline-none">
            <Logo />
          </div>
        </div>

        <p className="text-2xl">Insufficient Funds! </p>

        <p className="  text-xs font-light text-text ">
          {" "}
          Your account balance is insufficient to perform this action. Please
          add funds to your account to continue.
        </p>

        <div className="text-danger">
          <BanknotesIcon className="h-20 w-20 text-warning" />
        </div>

        <p className="text-sm ">Get credits for as low as Ksh. 10/=</p>

        <p className="  text-xs font-light text-text2">
          If You believe This Is A Mistake, Plesae Contact Support.{" "}
        </p>

        <div className="flex flex-row flex-wrap gap-2">
          <Link
            to="/support"
            className=" bg-tertiary hover:bg-complementary px-10 py-4 rounded-full text-text group inline-flex text-sm hover:text-buttontext"
          >
            Contact Support
          </Link>

          <Link
            to="/checkout"
            className=" bg-accent hover:bg-complementary px-10 py-4 rounded-full  group inline-flex text-sm text-buttontext hover:text-buttontext"
          >
            Buy Credits
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

          <Link
            to="/"
            className=" bg-tertiary hover:bg-complementary px-10 py-4 rounded-full text-text group inline-flex text-sm hover:text-buttontext"
          >
            Browse Catalogue
          </Link>
        </div>
      </div>
    </>
  );
}
