import { Link } from "react-router-dom";

import Logo from "~/components/common/Logo";

import type { MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
  return [
    { title: "Bagein • Unacuthorized Access" },
    {
      name: "description",
      content: "An Eco Friendly Assets didposal Platform  ",
    },
  ];
};

export default function unauthorized() {
  return (
    <>
      <div className="w-full min-h-screen bg-primary flex flex-col gap-8 items-center justify-center p-8">
        <div className="  flex flex-row  gap-1 justify-center items-center ">
          <div className="  flex flex-row  gap-2 justify-center items-center outline-none">
            <Logo />
          </div>
        </div>

        <p className="text-2xl">Unauthorized Access! </p>

        <p className="  text-xs font-light text-text2">
          {" "}
          The Resource You Requested Is Either Not Paid For Or Not owned By The
          Account Signed In
        </p>

        <div className="text-danger">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 20.962q-3.014-.895-5.007-3.651T5 11.1V5.692l7-2.615l7 2.615V11.1q0 .106-.003.212l-.008.211q-.187-.03-.368-.046q-.18-.015-.371-.015q-2.094.019-3.547 1.469t-1.453 3.53v4.02q-.297.16-.61.28t-.64.2m4.37.039q-.35 0-.62-.27t-.27-.618v-2.8q0-.35.27-.6t.62-.25h.11v-1q0-.749.511-1.259t1.259-.51t1.259.51t.51 1.258v1h.112q.358 0 .613.25q.256.25.256.6v2.8q0 .35-.256.62q-.255.269-.613.269zm.88-4.538h2v-1q0-.425-.288-.713t-.712-.288t-.712.288t-.288.713z"
            />
          </svg>
        </div>

        <p className="text-sm ">Please navigate to the Account page</p>

        <p className="  text-xs font-light text-text2">
          If You believe This Is A Mistake, Plesae Contact Support.{" "}
        </p>

        <div className="flex flex-row flex-wrap gap-2">
          <Link
            to="/support"
            className=" bg-accent hover:bg-complementary px-10 py-4 rounded-full  group inline-flex text-sm text-buttontext"
          >
            Contact support
          </Link>

          <Link
            to="/auth"
            className=" bg-accent hover:bg-complementary px-10 py-4 rounded-full  group inline-flex text-sm text-buttontext"
          >
            Account
          </Link>
        </div>
      </div>
    </>
  );
}
