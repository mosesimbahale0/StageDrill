import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "~/authContext";
import { UserIcon, QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import ThemeToggle from "../theme/ThemeToggle";

export default function Example() {
  const { user, loading } = useAuth();

  if (!user) {
    return null;
  }

  const initials = user?.displayName
    ?.split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="text-right w-full text-text">
      <Menu as="div" className="relative inline-block text-left w-full">
        <div className="w-full">
          <MenuButton className="inline-flex w-full justify-between  items-center    text-sm font-medium  hover:bg-tertiary rounded-full hover:text-text  p-1 focus:outline-none  focus-visible:ring-accent focus-visible:ring-opacity-75 ">
            <div className="flex flex-row gap-1 items-center justify-left ">
              <div className="rounded-full bg-gradient-to-br from-accent to-complementary  p-0.5">
                <div className="h-10 w-10  border-quaternary shadow-2xl flex justify-center items-center rounded-full  hover:bg-accent ">
                  <div className="flex justify-center items-center">
                    <span className="text-md text-buttontext">{initials}</span>
                  </div>
                </div>
              </div>

              <div className="relative inline-block">
                <p className=" text-left text-xs truncate ... w-40">
                  {user?.displayName}
                </p>
              </div>
            </div>

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
          </MenuButton>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems
            className="absolute left-2 rounded-2xl  p-2 w-64 origin-top-right divide-y divide-accent bg-tertiary shadow-lg ring-1 ring-tertiary focus:outline-none"
            style={{ top: "auto", bottom: "calc(100% + 0.5rem)" }}
          >
            <div className="">
              <MenuItem>
                <Link
                  to="/account"
                  className=" flex w-full items-center justify-center px-2 py-4 text-sm hover:bg-primary rounded-full  "
                >
                  <UserIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Account
                </Link>
              </MenuItem>

              <MenuItem>
                <Link
                  to="/support"
                  className="flex justify-left  items-center  "
                >
                  <div className=" flex w-full items-center justify-center px-2 py-4 text-sm hover:bg-primary text-text  rounded-full">
                    <QuestionMarkCircleIcon className="w-5 h-5" />
                    <p className="text-xs ">Support</p>
                  </div>
                </Link>
              </MenuItem>

              <MenuItem>
                <div className="w-full justify-center items-center flex p-2">
                  <ThemeToggle />
                </div>
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
