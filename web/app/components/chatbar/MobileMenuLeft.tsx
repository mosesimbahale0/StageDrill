import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FunspotSchema } from "~/types";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { PopoverButton, PopoverPanel } from "@headlessui/react";

export default function MobileMenuLeft(propsData: {
  propsData: FunspotSchema;
}) {
  const funspot = propsData.propsData;

  return (
    <>
      <div className=" px-1">
        <Popover className="relative z-20">
          {({ open }) => (
            <>
              <PopoverButton
                className={`
              ${open ? "" : ""}
              group inline-flex items-center  bg-accent/20  px-3 py-2 text-text font-medium hover:text-accent hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-complementary focus-visible:ring-opacity-75`}
              >
                {/* <Bars3Icon
                  className={`${open ? "" : "text-opacity-70"}
                h-7 w-7 text-accenttransition duration-150 ease-in-out group-hover:text-opacity-80`}
                  aria-hidden="true"
                /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="none"
                    d="M16 8a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 8m4 13.875h-2.875v-8H13v2.25h1.875v5.75H12v2.25h8Z"
                  />
                  <path
                    fill="currentColor"
                    d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 6a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 8m4 16.125h-8v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z"
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
                <PopoverPanel className="bg-tertiary absolute left-1/4 z-10 mt-2 w-screen h-80 rounded-xl   border border-tertiary max-w-xs -translate-x-6 transform px-1 sm:px-0 lg:max-w-3xl ">
                  <div className="w-full h-full p-4 overflow-hidden">
                    <p className="text-xl font-medium mb-2">{funspot.name}</p>
                    <p className="text-xs  text-text2 mb-4">
                      {funspot.description}
                    </p>
                    {/* <div className="flex flex-col gap-2">
                      <button className="bg-accent text-text px-4 py-2 rounded-md">
                        Start Chatting
                      </button>
                      <button className="bg-accent text-text px-4 py-2 rounded-md">
                        View Profile
                      </button>
                    </div> */}
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
