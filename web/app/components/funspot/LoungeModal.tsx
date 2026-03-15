import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Link } from "@remix-run/react";

import AudioTest from "./atoms/AudioTest";
import MicrophoneControl from "./atoms/MicrophoneControl";
import CameraControl from "./atoms/CameraControl";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// --- Style Objects ---
const sulphurPointFont = { fontFamily: "Sulphur Point, sans-serif" };

export default function LoungeModal(propsData3: { propsData3: any }) {
  let [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }
  const funspot = propsData3.propsData3;

  return (
    <>
      <div className="inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="shadow-sm bg-accent  hover:text-buttontext  hover:bg-gradient-to-tr hover:from-complementary hover:to-accent   h-14 px-6  rounded-full flex flex-row gap-2 items-center justify-center text-buttontext text-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="m17 9.5l.658-.329c1.946-.973 2.92-1.46 3.63-1.02c.712.44.712 1.528.712 3.703v.292c0 2.176 0 3.263-.711 3.703c-.712.44-1.685-.047-3.63-1.02L17 14.5zm-3.44-2.06a1.5 1.5 0 1 1-2.121 2.12a1.5 1.5 0 0 1 2.122-2.12Z" />
              <path
                stroke-linecap="round"
                d="M2 11.5v1c0 3.287 0 4.931.908 6.038a4 4 0 0 0 .554.554C4.57 20 6.212 20 9.5 20c3.287 0 4.931 0 6.038-.908q.304-.25.554-.554C17 17.43 17 15.788 17 12.5v-1c0-3.287 0-4.931-.908-6.038a4 4 0 0 0-.554-.554C14.43 4 12.788 4 9.5 4c-3.287 0-4.931 0-6.038.908a4 4 0 0 0-.554.554c-.428.522-.654 1.162-.774 2.038"
              />
            </g>
          </svg>
          New Meeting
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
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-secondary p-10 pt-2 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="h-16  text-text text-sm  flex flex-row gap-2  items-center text-left mb-6 border-b border-quaternary"
                  >
                    <p
                      className="lg:text-lg font-extrabold"
                      style={sulphurPointFont}
                    >
                      Your Meeting’s ready - Allow Microphone And Camera Access.
                    </p>
                  </DialogTitle>
                  <div className="flex flex-row flex-wrap items-center  mb-6 ">
                    <>
                      <div className="w-full flex flex-col gap-2 h-full items-center justify-center mb-2">
                        <>
                          <div className="w-full flex flex-col gap-2 px-2 text-text2 mb-4">
                            <p className="text-xs">{funspot.name}</p>
                          </div>
                        </>

                        <TabGroup>
                          <div className=" flex flex-col lg:flex-row gap- justify-center text-text w-96 mb-2">
                            <TabList className="flex flex-row gap-2 justify-between items-center bg-tertiary   w-full rounded-full  ">
                              <Tab
                                className={({ selected }) =>
                                  classNames(
                                    "rounded-full  w-1/3 h-12 p-2 items-center justify-center  text-xs",
                                    "focus:outline-none ",
                                    selected
                                      ? " bg-accent text-buttontext shadow rounded-full  flex  items-center justify-center "
                                      : "    rounded-full     flex items-center justify-center hover:text-complementary"
                                  )
                                }
                              >
                                Speaker
                              </Tab>

                              <Tab
                                className={({ selected }) =>
                                  classNames(
                                    "rounded-full  w-1/3 h-12 p-2 items-center justify-center  text-xs",
                                    "focus:outline-none ",
                                    selected
                                      ? " bg-accent text-buttontext shadow rounded-full  flex  items-center justify-center "
                                      : "    rounded-full     flex items-center justify-center hover:text-complementary"
                                  )
                                }
                              >
                                Microphone
                              </Tab>

                              <Tab
                                className={({ selected }) =>
                                  classNames(
                                    "rounded-full  w-1/3 h-12 p-2 items-center justify-center  text-xs",
                                    "focus:outline-none ",
                                    selected
                                      ? " bg-accent text-buttontext shadow rounded-full  flex  items-center justify-center "
                                      : "    rounded-full     flex items-center justify-center hover:text-complementary"
                                  )
                                }
                              >
                                Camera
                              </Tab>
                            </TabList>
                          </div>

                          <TabPanels className="h-full w-full  ">
                            <TabPanel className="h-full">
                              <AudioTest />
                            </TabPanel>

                            <TabPanel className="h-full">
                              <MicrophoneControl />
                            </TabPanel>

                            <TabPanel className="h-full">
                              <CameraControl />
                            </TabPanel>
                          </TabPanels>
                        </TabGroup>
                      </div>
                    </>
                  </div>

                  <div className="mt-4 w-full flex flex-wrap items-center justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md   px-4 py-2 text-sm font-medium hover:text-accent   focus:outline-none text-text "
                      onClick={closeModal}
                    >
                      Cancel
                    </button>

                    <Link
                      to={`/funspot/call/${funspot._id}/${funspot._account_Id}`}
                      className="shadow-sm bg-gradient-to-br from-complementary to-accent      text-buttontext hover:bg-gradient-to-tr hover:from-complementary hover:to-accent text-sm  h-14 px-6 rounded-full flex flex-row gap-2 items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="m17 9.5l.658-.329c1.946-.973 2.92-1.46 3.63-1.02c.712.44.712 1.528.712 3.703v.292c0 2.176 0 3.263-.711 3.703c-.712.44-1.685-.047-3.63-1.02L17 14.5zm-3.44-2.06a1.5 1.5 0 1 1-2.121 2.12a1.5 1.5 0 0 1 2.122-2.12Z" />
                          <path
                            stroke-linecap="round"
                            d="M2 11.5v1c0 3.287 0 4.931.908 6.038a4 4 0 0 0 .554.554C4.57 20 6.212 20 9.5 20c3.287 0 4.931 0 6.038-.908q.304-.25.554-.554C17 17.43 17 15.788 17 12.5v-1c0-3.287 0-4.931-.908-6.038a4 4 0 0 0-.554-.554C14.43 4 12.788 4 9.5 4c-3.287 0-4.931 0-6.038.908a4 4 0 0 0-.554.554c-.428.522-.654 1.162-.774 2.038"
                          />
                        </g>
                      </svg>
                       Continue to Meeting
                    </Link>
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
