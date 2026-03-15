import { Link, NavLink } from "@remix-run/react";
import Balance from "../Balance";
import MobileMenuLeft from "./MobileMenuLeft";
import MobileMenuRight from "./MobileMenuRight";
import { useAuth } from "~/authContext";
import { FunspotSchema, ProfileSchema, BalanceSchema } from "~/types";

import Logo from "~/components/common/Logo";
import LogoSymbol from "~/components/common/LogoSymbol";

const activeClassName =
  "text-accent  h-12 w-12  flex justify-center items-center ";

export default function Chatbar({
  funspot,
  profile,
  balance,
}: {
  funspot: FunspotSchema;
  profile: ProfileSchema;
  balance: BalanceSchema;
}) {
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
      <div className="z-50 ">
        <div className="lg:hidden w-full flex flex-row  items-center justify-between   p-2  h-16  fixed left-0 top-0 right-0  z-10  text-text bg-primary border-b border-secondary ">
          {/* TOP LEFT MOBILE  MENU  */}
          <MobileMenuLeft propsData={funspot} />

          {/* MOBILE TOPBAR */}

          <LogoSymbol />

          <Link
            to="/checkout"
            className="flex flex-row gap-2  justify-center items-center h-10 px-4 rounded-full   text-sm text-text2 hover:bg-accent hover:text-buttontext bg-secondary border border-tertiary"
          >
            <Balance propsData1={balance as BalanceSchema} />
          </Link>

          {/* TOP RIGHT  MENU  */}
          <MobileMenuRight
            propsData={{
              funspot,
              profile,
              balance,
              initials,
            }}
          />
        </div>

        {/* TOP LEFT BAR  */}
        <div
          className="hidden lg:flex    fixed left-0 top-0 py-2 pl-4
        z-10 w-2/3 h-20 rounded-br-full"
        >
          {/* <div className=" w-full lg:flex flex-row justify-center items-start gap-2   text-text  rounded-sm  h-14  bg-primary">
            <div className="flex  md:h-14 w-1/3 items-center justify-left pl-4 ">
              <div className="flex justify-center items-center  gap-3  ">
                <Logo />
              </div>
            </div>

            <div className="flex flex-col h-14 w-2/3 justify-center p-2 px-8  items-center bg-primary ">
              <div className=" w-full  flex flex-row justify-center items-center">
                <p className="text-sm text-text2 text-ellipsis truncate ... max-w-full ">
                  {funspot.name}
                </p>
              </div>
            </div>
          </div> */}
          <Logo />
        </div>

        {/* LEFT BOTTOM BAR  */}
        <div className="hidden lg:flex    fixed left-1 bottom-0 z-10 w-72  h-24 text-text    ">
          <div className=" w-full lg:flex flex-row justify-center items-center gap-2 px-2  divide-x text-text   rounded-sm h-24">
            <div className=" w-full  flex flex-col gap-4    text-text ">
              <div className=" h-10 flex flex-row justify-start items-center  gap-1 text-text2  ">
                <Link
                  to="/checkout"
                  className="  bg-primary flex flex-row gap-2  justify-center items-center h-10 px-4 rounded-full   text-sm text-text2 hover:bg-accent hover:text-buttontext border border-tertiary"
                >
                  <Balance propsData1={balance as BalanceSchema} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT BOTTOM BAR  */}
        <div className="hidden lg:flex    fixed right-1 bottom-0 z-10 w-56  h-24   ">
          <div className=" w-full lg:flex flex-col justify-center items-start gap-2 px-2   text-text   rounded-sm h-24 ">
            <div className=" w-full h-14 flex flex-row justify-center items-center gap-1 text-text2  ">
              <NavLink
                to={`/funspot/call/${funspot._id}/${profile._id}`}
                className={({ isActive }) =>
                  isActive
                    ? activeClassName
                    : "  text-text2 hover:text-accent hover:bg-accent/20  p-2 text-sm h-12 w-12 flex justify-center items-center rounded-full hover:bg-secondary"
                }
              >
                <div className="flex flex-col items-center ">
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
                </div>
              </NavLink>

              <NavLink
                to={`/funspot/chat/${funspot._id}/${profile._id}`}
                className={({ isActive }) =>
                  isActive
                    ? activeClassName
                    : "  text-text2 hover:text-accent hover:bg-accent/20  p-2 text-sm h-12 w-12 flex justify-center items-center rounded-full hover:bg-secondary"
                }
              >
                <div className="flex flex-col items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none">
                      <path
                        fill="currentColor"
                        d="m13.087 21.388l.645.382zm.542-.916l-.646-.382zm-3.258 0l-.645.382zm.542.916l.646-.382zM1.25 10.5a.75.75 0 0 0 1.5 0zm1.824 5.126a.75.75 0 0 0-1.386.574zm4.716 3.365l-.013.75zm-2.703-.372l-.287.693zm16.532-2.706l.693.287zm-5.409 3.078l-.012-.75zm2.703-.372l.287.693zm.7-15.882l-.392.64zm1.65 1.65l.64-.391zM4.388 2.738l-.392-.64zm-1.651 1.65l-.64-.391zM9.403 19.21l.377-.649zm4.33 2.56l.541-.916l-1.29-.764l-.543.916zm-4.007-.916l.542.916l1.29-.764l-.541-.916zm2.715.152a.52.52 0 0 1-.882 0l-1.291.764c.773 1.307 2.69 1.307 3.464 0zM10.5 2.75h3v-1.5h-3zm10.75 7.75v1h1.5v-1zM7.803 18.242c-1.256-.022-1.914-.102-2.43-.316L4.8 19.313c.805.334 1.721.408 2.977.43zM1.688 16.2A5.75 5.75 0 0 0 4.8 19.312l.574-1.386a4.25 4.25 0 0 1-2.3-2.3zm19.562-4.7c0 1.175 0 2.019-.046 2.685c-.045.659-.131 1.089-.277 1.441l1.385.574c.235-.566.338-1.178.389-1.913c.05-.729.049-1.632.049-2.787zm-5.027 8.241c1.256-.021 2.172-.095 2.977-.429l-.574-1.386c-.515.214-1.173.294-2.428.316zm4.704-4.115a4.25 4.25 0 0 1-2.3 2.3l.573 1.386a5.75 5.75 0 0 0 3.112-3.112zM13.5 2.75c1.651 0 2.837 0 3.762.089c.914.087 1.495.253 1.959.537l.783-1.279c-.739-.452-1.577-.654-2.6-.752c-1.012-.096-2.282-.095-3.904-.095zm9.25 7.75c0-1.622 0-2.891-.096-3.904c-.097-1.023-.299-1.862-.751-2.6l-1.28.783c.285.464.451 1.045.538 1.96c.088.924.089 2.11.089 3.761zm-3.53-7.124a4.25 4.25 0 0 1 1.404 1.403l1.279-.783a5.75 5.75 0 0 0-1.899-1.899zM10.5 1.25c-1.622 0-2.891 0-3.904.095c-1.023.098-1.862.3-2.6.752l.783 1.28c.464-.285 1.045-.451 1.96-.538c.924-.088 2.11-.089 3.761-.089zM2.75 10.5c0-1.651 0-2.837.089-3.762c.087-.914.253-1.495.537-1.959l-1.279-.783c-.452.738-.654 1.577-.752 2.6C1.25 7.61 1.25 8.878 1.25 10.5zm1.246-8.403a5.75 5.75 0 0 0-1.899 1.899l1.28.783a4.25 4.25 0 0 1 1.402-1.403zm7.02 17.993c-.202-.343-.38-.646-.554-.884a2.2 2.2 0 0 0-.682-.645l-.754 1.297c.047.028.112.078.224.232c.121.166.258.396.476.764zm-3.24-.349c.44.008.718.014.93.037c.198.022.275.054.32.08l.754-1.297a2.2 2.2 0 0 0-.909-.274c-.298-.033-.657-.038-1.069-.045zm6.498 1.113c.218-.367.355-.598.476-.764c.112-.154.177-.204.224-.232l-.754-1.297c-.29.17-.5.395-.682.645c-.173.238-.352.54-.555.884zm1.924-2.612c-.412.007-.771.012-1.069.045c-.311.035-.616.104-.909.274l.754 1.297c.045-.026.122-.058.32-.08c.212-.023.49-.03.93-.037z"
                      />
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 11h.009m3.982 0H12m3.991 0H16"
                      />
                    </g>
                  </svg>
                </div>
              </NavLink>

              <NavLink
                to={`/funspot/settings/${funspot._id}/${profile._id}`}
                className={({ isActive }) =>
                  isActive
                    ? activeClassName
                    : "  text-text2 hover:text-accent hover:bg-accent/20  p-2 text-sm h-12 w-12 flex justify-center items-center rounded-full hover:bg-secondary"
                }
              >
                <div className="flex flex-col items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="12" cy="12" r="3" />
                      <path
                        stroke-linecap="round"
                        d="M3.661 10.64c.473.296.777.802.777 1.36s-.304 1.064-.777 1.36c-.321.203-.529.364-.676.556a2 2 0 0 0-.396 1.479c.052.394.285.798.75 1.605c.467.807.7 1.21 1.015 1.453a2 2 0 0 0 1.479.396c.24-.032.483-.13.819-.308a1.62 1.62 0 0 1 1.567.008c.483.28.77.795.79 1.353c.014.38.05.64.143.863a2 2 0 0 0 1.083 1.083C10.602 22 11.068 22 12 22s1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083c.092-.223.129-.483.143-.863c.02-.558.307-1.074.79-1.353a1.62 1.62 0 0 1 1.567-.008c.336.178.58.276.82.308a2 2 0 0 0 1.478-.396c.315-.242.548-.646 1.014-1.453c.208-.36.369-.639.489-.873m-.81-2.766a1.62 1.62 0 0 1-.777-1.36c0-.559.304-1.065.777-1.362c.321-.202.528-.363.676-.555a2 2 0 0 0 .396-1.479c-.052-.394-.285-.798-.75-1.605c-.467-.807-.7-1.21-1.015-1.453a2 2 0 0 0-1.479-.396c-.24.032-.483.13-.82.308a1.62 1.62 0 0 1-1.566-.008a1.62 1.62 0 0 1-.79-1.353c-.014-.38-.05-.64-.143-.863a2 2 0 0 0-1.083-1.083C13.398 2 12.932 2 12 2s-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083c-.092.223-.129.483-.143.863a1.62 1.62 0 0 1-.79 1.353a1.62 1.62 0 0 1-1.567.008c-.336-.178-.58-.276-.82-.308a2 2 0 0 0-1.478.396C4.04 5.79 3.806 6.193 3.34 7c-.208.36-.369.639-.489.873"
                      />
                    </g>
                  </svg>
                </div>
              </NavLink>

              <Link
                to="/account"
                className="flex flex-col gap-2  justify-center items-center  h-full  "
              >
                <div className="h-12 w-12 border-2 bg-primary border-quaternary shadow-2xl flex justify-center items-center rounded-full  hover:bg-accent ">
                  <div className="flex justify-center items-center">
                    <span className="text-md text-text">{initials}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
