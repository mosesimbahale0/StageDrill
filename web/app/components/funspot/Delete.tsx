import { useNavigate } from "@remix-run/react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { ExclamationCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import React, { useContext, useCallback } from "react";
import { SnackbarContext } from "~/context/SnackbarContext";
import { UsersIcon } from "@heroicons/react/24/outline";
import { FunspotSchema } from "~/types";

interface DeleteModalProps {
  propsData3: FunspotSchema; // or whatever type fits
  handleDelete;
}

export default function DeleteModal({
  propsData3,
  handleDelete,
}: DeleteModalProps) {
  const { showSnackbar }: any = useContext(SnackbarContext);
  const navigate = useNavigate();
  let [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }
  const funspotId = propsData3._id;
  const handleConfirmDelete = useCallback(async () => {
    try {
      await handleDelete(funspotId);
      showSnackbar("Funspot deleted successfully!", "success");
      // navigate(`/home/${propsData3._account_Id}`);
    } catch (error) {
      showSnackbar("Failed to delete funspot.", "error");
      console.error("Error deleting funspot:", error);
    } finally {
      closeModal();
    }
  }, [funspotId, handleDelete, showSnackbar, navigate, closeModal]);


    // --- Style Objects ---
  const sulphurPointFont = { fontFamily: "Sulphur Point, sans-serif" };

  
  return (
    <>
      <div className="inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="   bg-secondary  hover:bg-danger hover:text-buttontext   w-14 h-14 rounded-full flex justify-center items-center  "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" d="M20.5 6h-17" />
              <path d="M6.5 6h.11a2 2 0 0 0 1.83-1.32l.034-.103l.097-.291c.083-.249.125-.373.18-.479a1.5 1.5 0 0 1 1.094-.788C9.962 3 10.093 3 10.355 3h3.29c.262 0 .393 0 .51.019a1.5 1.5 0 0 1 1.094.788c.055.106.097.23.18.479l.097.291A2 2 0 0 0 17.5 6" />
              <path
                stroke-linecap="round"
                d="M18.374 15.4c-.177 2.654-.266 3.981-1.131 4.79s-2.195.81-4.856.81h-.774c-2.66 0-3.99 0-4.856-.81c-.865-.809-.953-2.136-1.13-4.79l-.46-6.9m13.666 0l-.2 3"
              />
            </g>
          </svg>
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
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-secondary p-8 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className=" text-text text-sm  flex flex-row gap-2  items-center justify-evenly border-b border-quaternary pb-4 "
                  >
                    <ExclamationCircleIcon className="h-20 w-20 text-danger " />
                    <p className=" font-extrabold text-xl"
              style={sulphurPointFont}
                    >
                      Are you sure you want to delete this funspot?
                    </p>
                  </DialogTitle>
                  <div className="my-4 flex flex-col gap-2">
                    <img
                      src={propsData3.cover}
                      alt={propsData3.name}
                      className="h-24 object-contain "
                    />

                    <div className="flex flex-row items-center justify-start text-text ">
                      <div className="flex flex-col  w-full">
                        <h3 className="text-sm  w-5/6  truncate ...">
                          {propsData3.name}
                        </h3>
                        <p className="text-text text-[10px] w-5/6  truncate ...">
                          {propsData3.description}
                        </p>
                      </div>
                    </div>

                    <div className="w-full flex flex-row gap-1 justify-left items-center text-text2">
                      <UsersIcon className="h-6 w-6 " />

                      <p className="text-xs text-ellipsis truncate ... w-5/6 ">
                        {propsData3.characters.length} character(s)
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 text-text">
                      <p className="text-xs">
                        This action cannot be undone and will permanently erase
                        the Funspot along with all history and chats associated
                        with it.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 w-full flex flex-wrap justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md   px-4 py-2 text-sm font-medium text-text hover:text-accent  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      className="inline-flex justify-center rounded-full bg-danger px-4 py-2 hover:bg-danger2 text-sm font-medium    focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ml-3 text-buttontext "
                    >
                      Delete
                    </button>
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
