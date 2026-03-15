import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { NavLink } from "@remix-run/react";
import { useProfile } from "~/context/ProfileProvider";
import {
  HomeIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  UserIcon,
  ChartBarIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  BellIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";

import { PopoverButton, PopoverPanel } from "@headlessui/react";

const MobileMenuLeft = () => {
  const { profile, profileLoading, profileError } = useProfile();

  const accountId = profile._id;
  // console.table(profile)

  const activeClassName =
    "border-l-4 border-accent bg-accent/10 rounded-sm text-accent p-2 text-sm h-24 w-24 flex justify-center items-center";
  return (
    <>
      <div className=" px-1 z-20">
        <Popover className="relative ">
          {({ open }) => (
            <>
              <PopoverButton
                className={`
              ${open ? "" : ""}
              group inline-flex items-center  bg-accent/20  hover:g-complementary/20  p-3 rounded-full text-base font-medium text-accent hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-complementary focus-visible:ring-opacity-75`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="currentColor"
                    d="M24.808 2.954a3.25 3.25 0 0 0-4.596 0l-3.213 3.213A3.25 3.25 0 0 0 13.75 3h-7.5A3.25 3.25 0 0 0 3 6.25v19.5A3.25 3.25 0 0 0 6.25 29h19.5A3.25 3.25 0 0 0 29 25.75v-7.5a3.25 3.25 0 0 0-3.158-3.249l3.209-3.208a3.25 3.25 0 0 0 0-4.596zM19.176 15H17v-2.176zm2.45-10.632a1.25 1.25 0 0 1 1.768 0l4.242 4.243a1.25 1.25 0 0 1 0 1.768l-4.242 4.242a1.25 1.25 0 0 1-1.768 0l-4.243-4.242a1.25 1.25 0 0 1 0-1.768zM15 6.25V15H5V6.25C5 5.56 5.56 5 6.25 5h7.5c.69 0 1.25.56 1.25 1.25M5 25.75V17h10v10H6.25C5.56 27 5 26.44 5 25.75M17 17h8.75c.69 0 1.25.56 1.25 1.25v7.5c0 .69-.56 1.25-1.25 1.25H17z"
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
                <PopoverPanel className="absolute left-1/4 mt-2 w-screen   bg-secondary border border-tertiary max-w-xs -translate-x-6 transform px-1 sm:px-0 lg:max-w-3xl ">
                  <div className="w-full h-full ">
                    <div className=" flex flex-row flex-wrap gap-2">
                      <NavLink
                        to={`/home/${accountId}`}
                        className={({ isActive }) =>
                          isActive
                            ? activeClassName
                            : "  text-text hover:text-accent hover:bg-accent/20 text-sm h-24 w-24  flex justify-center items-center"
                        }
                      >
                        <div className="flex flex-col items-center justify-center px-1 gap-2">
                          <HomeIcon className="w-5 h-5 text-text" />
                          <p className="text-xs ">Home</p>
                        </div>
                      </NavLink>

                      <NavLink
                        to={`/store/${accountId}`}
                        className={({ isActive }) =>
                          isActive
                            ? activeClassName
                            : "  text-text hover:text-accent hover:bg-accent/20 text-sm h-24 w-24  flex justify-center items-center"
                        }
                      >
                        <div className="flex flex-col items-center justify-center px-1 gap-2">
                          <BuildingStorefrontIcon className="w-5 h-5 " />
                          <p className="text-xs ">Store</p>
                        </div>
                      </NavLink>

                      <NavLink
                        to="/stats"
                        className={({ isActive }) =>
                          isActive
                            ? activeClassName
                            : "  text-text hover:text-accent hover:bg-accent/20 text-sm h-24 w-24  flex justify-center items-center"
                        }
                      >
                        <div className="flex flex-col items-center justify-center px-1 gap-2">
                          <ChartBarIcon className="w-5 h-5" />
                          <p className="text-xs ">Stats</p>
                        </div>
                      </NavLink>

                      <NavLink
                        to="/checkout"
                        className={({ isActive }) =>
                          isActive
                            ? activeClassName
                            : "  text-text hover:text-accent hover:bg-accent/20 text-sm h-24 w-24  flex justify-center items-center"
                        }
                      >
                        <div className="flex flex-col items-center justify-center px-1 gap-2">
                          <ShoppingBagIcon className="w-5 h-5" />
                          <p className="text-xs ">Buy tokens</p>
                        </div>
                      </NavLink>

                      <NavLink
                        to="/notifications"
                        className={({ isActive }) =>
                          isActive
                            ? activeClassName
                            : "  text-text hover:text-accent hover:bg-accent/20 text-sm h-24 w-24  flex justify-center items-center"
                        }
                      >
                        <div className="flex flex-col items-center justify-center px-1 gap-2">
                          <BellIcon className="w-5 h-5" />
                          <p className="text-xs ">Notifications</p>
                        </div>
                      </NavLink>

                      <NavLink
                        to="/transactions"
                        className={({ isActive }) =>
                          isActive
                            ? activeClassName
                            : "  text-text hover:text-accent hover:bg-accent/20 text-sm h-24 w-24  flex justify-center items-center"
                        }
                      >
                        <div className="flex flex-col items-center justify-center px-1 gap-2">
                          <CreditCardIcon className="w-5 h-5" />
                          <p className="text-xs ">Transactions</p>
                        </div>
                      </NavLink>

                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          isActive
                            ? activeClassName
                            : "  text-text hover:text-accent hover:bg-accent/20 text-sm h-24 w-24  flex justify-center items-center"
                        }
                      >
                        <div className="flex flex-col items-center justify-center px-1 gap-2">
                          <UserIcon className="w-5 h-5 " />
                          <p className="text-xs ">Profile</p>
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
};

export default MobileMenuLeft;
