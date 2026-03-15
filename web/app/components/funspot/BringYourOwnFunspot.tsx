import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Link } from "@remix-run/react";

import { TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAuth } from "~/authContext";

// --- Style Objects ---
const sulphurPointFont = { fontFamily: "Sulphur Point, sans-serif" };

export default function BringYourOwnFunspot() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const { user, loading } = useAuth();

  return (
    <>
      <div className=" flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className=" shadow-2xl  text-xs bg-gradient-to-br  from-accent to-complementary hover:bg-gradient-to-tr hover:from-complementary hover:to-accent   p-4  rounded-full   flex flex-row justify-center items-center gap-2 text-buttontext"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M11.883 3.007L12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3z"
            />
          </svg>
          Create Funspot
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-3xl" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-secondary p-12 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-xl font-semibold leading-6 text-text mb-6 border-b border-quaternary pb-2"
                    style={sulphurPointFont}
                  >
                    Expand Your Rehearsal Horizons! (Coming Soon!)
                  </DialogTitle>
                  <div className="mt-2 flex flex-col gap-4 text-text2">
                    <p className="text-sm">
                      Have a brilliant idea for a Funspot that's not in our
                      template store? Need support for a specific language or a
                      truly unique use case?
                    </p>

                    <div>
                      <p className="mt-2 text-xs">
                        We're working hard to empower you to bring those visions
                        to life! Soon, you'll be able to:
                      </p>
                      <ul className="list-disc list-inside mt-2 text-xs">
                        <li>
                          Submit detailed descriptions of your custom Funspot
                          needs.
                        </li>
                        <li>
                          Our team will review your request and provide
                          feedback.
                        </li>
                        <li>
                          We'll train and deploy a custom model tailored to your
                          exact specifications.{" "}
                        </li>
                      </ul>
                    </div>
                    <p className="mt-4 text-xs ">
                      This feature is in development. In the meantime, explore
                      our diverse template store for inspiration and get started
                      with a Template that's ready to go!
                    </p>

                    <div className="flex flex-row gap-8 w-full justify-end mt-4">
                      <button
                        type="button"
                        className="font-medium text-text hover:text-accent"
                        onClick={closeModal}
                      >
                        Got it
                      </button>

                      <Link
                        to={`/store/${user?.uid}`}
                        className=" bg-accent hover:bg-complementary px-10 py-4 rounded-full hover:text-text group inline-flex text-sm text-buttontext"
                      >
                        Browse Templates{" "}
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
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
