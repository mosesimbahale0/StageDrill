import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { UserIcon, QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useAuth } from "~/authContext";

import { PopoverButton, PopoverPanel } from "@headlessui/react";

export default function MobileMenuRight() {
  const { user, loading } = useAuth();

  if (!user) {
    return null;
  }

  const initials = user?.displayName
    ?.split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  return (
    <>
      <div className="  rounded-full bg-accent">
        <Popover className="relative z-20">
          {({ open }) => (
            <>
              <PopoverButton
                className={`
                ${open ? "" : "text-opacity-90"}
                group flex items-center rounded-full justify-center w-10 h-10 outline-none`}
              >
                <div className="  flex justify-center items-center   text-text outline-none">
                  <div className=" flex justify-center items-center rounded-full  hover:bg-accent ">
                    <div className="flex justify-center items-center">
                      <span className="text-md text-buttontext ">{initials}</span>
                    </div>
                  </div>
                </div>
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
                <PopoverPanel className="  absolute z-10 right-0 transform translate-x-4 xs:translate-x-6  mt-2 mr-2 px-2 w-56 sm:max-w-screen sm:px-0 ">
                  <div className="overflow-hidden shadow-lg ring-1 ring-tertiary bg-secondary rounded-3xl">
                    <div className="flex flex-col gap-2 bg-primary p-1  ">
                      <Link
                        to="/account"
                        className="flex w-full items-center justify-center py-4 text-sm hover:bg-tertiary hover:text-complementary text-text rounded-3xl"
                      >
                        <UserIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                        Account
                      </Link>

                      <Link
                        to="/support"
                        className="flex w-full items-center justify-center  py-4 text-sm hover:bg-tertiary hover:text-complementary text-text rounded-3xl"
                      >
                        <QuestionMarkCircleIcon className="w-5 h-5" />
                        Support
                      </Link>
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
