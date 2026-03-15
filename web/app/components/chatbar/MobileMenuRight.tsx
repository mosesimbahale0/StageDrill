import { Link, NavLink } from "@remix-run/react";
import {
  Popover,
  Transition,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { Fragment } from "react";
import { FunspotSchema } from "~/types";

const activeClassName =
  "border border-accent bg-gradient-to-r from-accent/30 to-accent/10 rounded-sm text-accent p-2 text-sm h-24 w-24 flex justify-center items-center ";

type MobileMenuRightProps = {
  propsData: {
    funspot: FunspotSchema;
    profile: ProfileSchema;
    balance: BalanceSchema;
    initials?: string;
  };
};

export default function MobileMenuRight({ propsData }: MobileMenuRightProps) {
  const balance = propsData.balance;
  const funspot = propsData.funspot;
  const profile = propsData.profile;
  const initials = propsData.initials;

  return (
    <>
      <div className=" ">
        <Popover className="relative z-20">
          {({ open }) => (
            <>
              <PopoverButton
                className={`
              ${open ? "" : ""}
              group inline-flex items-center rounded-full  bg-accent/20  p-3 text-base font-medium text-text hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-complementary focus-visible:ring-opacity-75`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M7 3a4 4 0 0 1 3.874 3H19v2h-8.126A4.002 4.002 0 0 1 3 7a4 4 0 0 1 4-4m0 6a2 2 0 1 0 0-4a2 2 0 0 0 0 4m10 11a4 4 0 0 1-3.874-3H5v-2h8.126A4.002 4.002 0 0 1 21 16a4 4 0 0 1-4 4m0-2a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
                    clip-rule="evenodd"
                  />
                </svg>
              </PopoverButton>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="  absolute  right-0 transform translate-x-2 xs:translate-x-1  mt-2 mr-2 px-2 w-56 sm:max-w-screen sm:px-0 z-20">
                  <div className="overflow-hidden shadow-lg  ring-tertiary  max-h-screen mx-auto ">
                    <div className="flex flex-row flex-wrap bg-secondary ">
                      <NavLink
                        to={`/funspot/call/${funspot._id}/${profile._id}`}
                        className={({ isActive }) =>
                          isActive
                            ? activeClassName
                            : "  text-text hover:text-accent hover:bg-accent/20 text-sm h-24 w-24  flex justify-center items-center"
                        }
                      >
                        <div className="flex flex-col items-center ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2em"
                            height="2em"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="currentColor"
                              d="M4 16.25A6.25 6.25 0 0 1 10.25 10h14.5A6.25 6.25 0 0 1 31 16.25v15.5A6.25 6.25 0 0 1 24.75 38h-14.5A6.25 6.25 0 0 1 4 31.75zm34.907 19.168L33 31.339v-14.68l5.907-4.078c2.156-1.488 5.097.055 5.097 2.675v17.487c0 2.62-2.941 4.163-5.097 2.675"
                            />
                          </svg>
                          <p className="text-[10px]">Meet</p>
                        </div>
                      </NavLink>

                      <NavLink
                        to={`/funspot/chat/${funspot._id}/${profile._id}`}
                        className={({ isActive }) =>
                          isActive
                            ? activeClassName
                            : "  text-text hover:text-accent hover:bg-accent/20 text-sm h-24 w-24  flex justify-center items-center"
                        }
                      >
                        <div className="flex flex-col items-center ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2em"
                            height="2em"
                            viewBox="0 0 24 24"
                          >
                            <g fill="none">
                              <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                              <path
                                fill="currentColor"
                                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10H4a2 2 0 0 1-2-2v-8C2 6.477 6.477 2 12 2m0 12H9a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2m3-4H9a1 1 0 0 0-.117 1.993L9 12h6a1 1 0 0 0 .117-1.993z"
                              />
                            </g>
                          </svg>
                          <p className="text-[10px]">Chat</p>
                        </div>
                      </NavLink>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </>
  );
}
