// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useState } from "react";
// import { Link } from "@remix-run/react";

// import { TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";
// import { useAuth } from "~/authContext";

// // --- Style Objects ---
// const sulphurPointFont = { fontFamily: "Sulphur Point, sans-serif" };

// export default function BringYourOwnFunspot() {
//   let [isOpen, setIsOpen] = useState(false);

//   function closeModal() {
//     setIsOpen(false);
//   }

//   function openModal() {
//     setIsOpen(true);
//   }

//   const { user, loading } = useAuth();

//   return (
//     <>
//       <div className=" flex items-center justify-center">
//         <button
//           type="button"
//           onClick={openModal}
//           className=" shadow-2xl  text-xs bg-gradient-to-br  from-accent to-complementary hover:bg-gradient-to-tr hover:from-complementary hover:to-accent   p-4  px-8 h-14 rounded-full   flex flex-row justify-center items-center gap-2 text-buttontext"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="32"
//             height="32"
//             viewBox="0 0 24 24"
//           >
//             <path
//               fill="currentColor"
//               d="m3.342 15.65l-1.511-1.461q-.32-.3-.31-.73q.01-.428.329-.747q1.95-1.99 4.659-3.101T11.997 8.5t5.489 1.11q2.708 1.111 4.664 3.102q.32.319.329.748q.01.428-.31.728l-1.511 1.462q-.333.314-.724.358q-.392.044-.73-.2l-2.131-1.623q-.296-.227-.434-.486t-.139-.583v-2.793q-1.22-.434-2.277-.629Q13.166 9.5 12 9.5t-2.223.194t-2.277.629v2.793q0 .323-.139.583t-.434.486l-2.13 1.623q-.34.244-.73.2q-.392-.044-.725-.358M6.5 10.68q-1.071.491-2.073 1.18q-1.002.69-1.727 1.386q-.096.096-.096.193q0 .096.096.192l1.192 1.173q.097.096.24.125q.145.029.26-.067l1.877-1.42q.097-.076.164-.192t.067-.211zm11 .012v2.347q0 .096.067.211t.164.192l1.877 1.42q.115.096.26.067q.143-.029.24-.125l1.192-1.162q.096-.096.096-.192t-.096-.192q-.725-.708-1.727-1.394q-1.002-.687-2.073-1.172m0 0"
//             />
//           </svg>
//         </button>
//       </div>

//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={closeModal}>
//           <TransitionChild
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black/25 backdrop-blur-3xl" />
//           </TransitionChild>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <TransitionChild
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-secondary p-12 text-left align-middle shadow-xl transition-all">
//                   <DialogTitle
//                     as="h3"
//                     className="text-xl font-semibold leading-6 text-text mb-6 border-b border-quaternary pb-2"
//                     style={sulphurPointFont}
//                   >
//                     End Session?
//                   </DialogTitle>
//                   <div className="mt-2 flex flex-col gap-4 text-text2">
//                     <p className="text-sm">
//                       Are you sure you want to end this session?
//                     </p>

//                     <div className="flex flex-row gap-8 w-full justify-end mt-4">
//                       <button
//                         type="button"
//                         className="font-medium text-text hover:text-accent"
//                         onClick={closeModal}
//                       >
//                         Cancel
//                       </button>

//                       <a className="bg-danger h-14 px-8 gap-2 text-xs  rounded-full flex flex-row justify-center items-center hover:bg-danger2 text-buttontext ">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="32"
//                           height="32"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             fill="currentColor"
//                             d="m3.342 15.65l-1.511-1.461q-.32-.3-.31-.73q.01-.428.329-.747q1.95-1.99 4.659-3.101T11.997 8.5t5.489 1.11q2.708 1.111 4.664 3.102q.32.319.329.748q.01.428-.31.728l-1.511 1.462q-.333.314-.724.358q-.392.044-.73-.2l-2.131-1.623q-.296-.227-.434-.486t-.139-.583v-2.793q-1.22-.434-2.277-.629Q13.166 9.5 12 9.5t-2.223.194t-2.277.629v2.793q0 .323-.139.583t-.434.486l-2.13 1.623q-.34.244-.73.2q-.392-.044-.725-.358M6.5 10.68q-1.071.491-2.073 1.18q-1.002.69-1.727 1.386q-.096.096-.096.193q0 .096.096.192l1.192 1.173q.097.096.24.125q.145.029.26-.067l1.877-1.42q.097-.076.164-.192t.067-.211zm11 .012v2.347q0 .096.067.211t.164.192l1.877 1.42q.115.096.26.067q.143-.029.24-.125l1.192-1.162q.096-.096.096-.192t-.096-.192q-.725-.708-1.727-1.394q-1.002-.687-2.073-1.172m0 0"
//                           />
//                         </svg>
//                         End Session
//                       </a>
//                     </div>
//                   </div>
//                 </DialogPanel>
//               </TransitionChild>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// }



import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
// Removed unused Link import from "@remix-run/react"

// Assuming useAuth is correctly defined in this path
import { useAuth } from "~/authContext";

// --- Style Objects ---
const sulphurPointFont = { fontFamily: "Sulphur Point, sans-serif" };

// --- SVG Icon Component ---
const EndSessionIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="m3.342 15.65l-1.511-1.461q-.32-.3-.31-.73q.01-.428.329-.747q1.95-1.99 4.659-3.101T11.997 8.5t5.489 1.11q2.708 1.111 4.664 3.102q.32.319.329.748q.01.428-.31.728l-1.511 1.462q-.333.314-.724.358q-.392.044-.73-.2l-2.131-1.623q-.296-.227-.434-.486t-.139-.583v-2.793q-1.22-.434-2.277-.629Q13.166 9.5 12 9.5t-2.223.194t-2.277.629v2.793q0 .323-.139.583t-.434.486l-2.13 1.623q-.34.244-.73.2q-.392-.044-.725-.358M6.5 10.68q-1.071.491-2.073 1.18q-1.002.69-1.727 1.386q-.096.096-.096.193q0 .096.096.192l1.192 1.173q.097.096.24.125q.145.029.26-.067l1.877-1.42q.097-.076.164-.192t.067-.211zm11 .012v2.347q0 .096.067.211t.164.192l1.877 1.42q.115.096.26.067q.143-.029.24-.125l1.192-1.162q.096-.096.096-.192t-.096-.192q-.725-.708-1.727-1.394q-1.002-.687-2.073-1.172m0 0"
    />
  </svg>
);

export default function BringYourOwnFunspot() {
  let [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth(); // This is kept but not used, as in original code

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className=" shadow-2xl text-xs bg-danger hover:bg-danger2 p-4 px-8 h-14 rounded-full flex flex-row justify-center items-center gap-2 text-buttontext"
        >
          <EndSessionIcon />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        {/* The Dialog component now correctly uses dot notation for its children */}
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-3xl" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-secondary p-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-text mb-6 border-b border-quaternary pb-2"
                    style={sulphurPointFont}
                  >
                    End Session
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-4 text-text2">
                    <p className="text-sm">
                      Are you sure you want to end this session?
                    </p>

                    <div className="flex flex-row gap-8 w-full justify-end mt-4">
                      <button
                        type="button"
                        className="font-medium text-text hover:text-accent"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      
                      {/* This is now a standard <a> tag. Clicking it will navigate to /account and force a full page reload. */}
                      <a
                        href="/account"
                        className="bg-danger h-14 px-8 gap-2 text-xs rounded-full flex flex-row justify-center items-center hover:bg-danger2 text-buttontext"
                      >
                        <EndSessionIcon />
                        End Session
                      </a>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
