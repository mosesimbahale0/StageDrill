import { Link, NavLink } from "@remix-run/react";
import MobileMenuLeft from "./sidebar/MobileMenuLeft";
import MobileMenuRight from "./sidebar/MobileMenuRight";
import MobileMenuBottom from "./sidebar/MobileMenuBottom";
import AccountOptions from "./sidebar/AccountOptions";

import ThemeToggle from "~/components/theme/ThemeToggle";

import { useAuth } from "~/authContext";
import { useProfile } from "~/context/ProfileProvider";

import Logo from "./common/Logo";
import LogoSymbol from "./common/LogoSymbol";

import { Fragment, useState, useEffect } from "react";

const Sidebar = () => {
  const activeClassName =
    "text-text rounded-full  w-full text-sm  h-12 flex justify-left  items-center px-4  bg-secondary ";

  const { user, loading } = useAuth();

  // const { profile, profileLoading, profileError } = useProfile();

  // const accountId = profile._id;
  // // console.table(profile)

  // console.log(accountId  +"---------------------------------------------000000000")

  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowShadow(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="z-50">
        {/* <div className="lg:hidden w-full flex flex-row  items-center justify-between  p-2  h-16 fixed left-0 top-0 right-0  z-10 bg-primary   "> */}
        <div
          className={`lg:hidden fixed top-0 left-0 right-0 h-16 flex justify-between items-center z-20 transition-all duration-300 transform px-2 ${showShadow
            ? "shadow-sm shadow-black/30 bg-primary backdrop-blur-sm"
            : "shadow-none"
            }`}
        >
          {/* MOBILE TOPBAR */}
          <Logo />
          {/* TOP LEFT MOBILE  MENU  */}
          {/* <MobileMenuLeft /> */}
          {/* <ThemeToggle /> */}
          {/* TOP RIGHT  MENU  */}
          <MobileMenuRight />
        </div>

        {/* BOTTOM RIGHT CREATE FUNSPOT */}
        {/* <div className=" flex items-center flex-col justify-center w-16 h-16 rounded-full fixed right-24 bottom-3  z-10  ">
        <CreateModal />
        </div> */}
        {/* BOTTOM RIGHT CREATE FUNSPOT */}

        {/* BOTTOM RIGHT  MENU NOTE */}
        {/* <div className=" flex items-center flex-col justify-center w-16 h-16 rounded-full fixed right-4 bottom-3  z-10  ">
        <Menu />
        </div> */}
        {/* BOTTOM RIGHT  MENU NOTE  */}

        {/* SIDEBAR LEFT  */}

        {/* SIDEBAR LEFT  */}

        {/* MOBILE BOTTOM NAVIGATION */}
        <MobileMenuBottom />

        <div className="w-64 hidden lg:flex flex-col   fixed left-0 top-0 bottom-0 z-10  p-2">
          <div className="bg-primary text-text rounded-lg  w-full h-full">
            <div className="rounded-lg h-full w-full lg:flex flex-col items-center justify-start">
              <div className="flex  md:h-20 px-2  w-full  ">
                <div className="flex justify-center items-center  gap-3  ">
                  <Logo />
                </div>
              </div>

              <div className="w-full h-full     py-2  overflow-x-hidden">
                <div className=" flex flex-col  gap-0.5 h-full w-full  text-text2 text-sm">
                  {/* <p  className="text-lg  w-full text-left px-2 py-6 truncate..." >
                    Hello,{auth.currentUser?.displayName}
                  </p> */}

                  <NavLink
                    to={`/home/account`}
                    className={({ isActive }) =>
                      isActive
                        ? activeClassName
                        : "  h-12 flex justify-left px-4 items-center  hover:bg-secondary rounded-full   "
                    }
                  >
                    <div className=" flex flex-row items-center justify-center px-1 gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-width="1.5"
                          d="M12 15v3m10-5.796v1.521c0 3.9 0 5.851-1.172 7.063S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.212S2 17.626 2 13.725v-1.521c0-2.289 0-3.433.52-4.381c.518-.949 1.467-1.537 3.364-2.715l2-1.241C9.889 2.622 10.892 2 12 2s2.11.622 4.116 1.867l2 1.241c1.897 1.178 2.846 1.766 3.365 2.715"
                        />
                      </svg>

                      <p className="text-xs   ">Home</p>
                    </div>
                  </NavLink>

                  <NavLink
                    to={`/store/account`}
                    className={({ isActive }) =>
                      isActive
                        ? activeClassName
                        : "  h-12 flex justify-left px-4 items-center  hover:bg-secondary rounded-full  "
                    }
                  >
                    <div className="flex flex-row items-center justify-center px-1 gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-width="1.5"
                        >
                          <path d="M3.5 11v3c0 3.771 0 5.657 1.172 6.828S7.729 22 11.5 22h1c3.771 0 5.657 0 6.828-1.172M20.5 11v3c0 1.17 0 2.158-.035 3" />
                          <path d="M9.5 2h5m-5 0l-.652 6.517a3.167 3.167 0 1 0 6.304 0L14.5 2m-5 0H7.418c-.908 0-1.362 0-1.752.107a3 3 0 0 0-1.888 1.548M9.5 2l-.725 7.245a3.06 3.06 0 1 1-6.043-.904L2.8 8m11.7-6h2.082c.908 0 1.362 0 1.752.107a3 3 0 0 1 1.888 1.548c.181.36.27.806.448 1.696l.598 2.99a3.06 3.06 0 1 1-6.043.904zm-5 19.5v-3c0-.935 0-1.402.201-1.75a1.5 1.5 0 0 1 .549-.549C10.598 16 11.065 16 12 16s1.402 0 1.75.201a1.5 1.5 0 0 1 .549.549c.201.348.201.815.201 1.75v3" />
                        </g>
                      </svg>

                      <p className="text-xs      ">Template Store</p>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/checkout"
                    className={({ isActive }) =>
                      isActive
                        ? activeClassName
                        : "  h-12 flex justify-left px-4 items-center  hover:bg-secondary rounded-full  "
                    }
                  >
                    <div className="flex flex-row items-center justify-center px-1 gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-width="1.5"
                        >
                          <path d="M3.172 20.828C4.343 22 6.229 22 10 22h4c3.771 0 5.657 0 6.828-1.172S22 17.771 22 14c0-1.17 0-2.158-.035-3m-1.137-3.828C19.657 6 17.771 6 14 6h-4C6.229 6 4.343 6 3.172 7.172S2 10.229 2 14c0 1.17 0 2.158.035 3M12 2c1.886 0 2.828 0 3.414.586S16 4.114 16 6M8.586 2.586C8 3.172 8 4.114 8 6" />
                          <path d="M12 17.333c1.105 0 2-.746 2-1.666S13.105 14 12 14s-2-.746-2-1.667c0-.92.895-1.666 2-1.666m0 6.666c-1.105 0-2-.746-2-1.666m2 1.666V18m0-8v.667m0 0c1.105 0 2 .746 2 1.666" />
                        </g>
                      </svg>

                      <p className="text-xs      ">Get Credits</p>
                    </div>
                  </NavLink>

                  <NavLink
                    to={`/transactions/account`}
                    className={({ isActive }) =>
                      isActive
                        ? activeClassName
                        : "  h-12 flex justify-left px-4 items-center  hover:bg-secondary rounded-full  "
                    }
                  >
                    <div className="flex flex-row items-center justify-center px-1 gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-width="1.5"
                          d="M2 2h20M8.049 18.53C9.932 20.178 10.873 21 12 21s2.069-.823 3.951-2.47l2-1.748c1.008-.882 1.513-1.322 1.78-1.913c.269-.59.269-1.26.269-2.599V9.702M20 6V2H4v10.27c0 1.34 0 2.009.268 2.6c.175.385.451.707.903 1.13M8.5 13h7m-7-5h7"
                        />
                      </svg>

                      <p className="text-xs      ">Transactions</p>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/stats"
                    className={({ isActive }) =>
                      isActive
                        ? activeClassName
                        : "  h-12 flex justify-left px-4 items-center  hover:bg-secondary rounded-full  "
                    }
                  >
                    <div className="flex flex-row items-center justify-center px-1 gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-width="1.5"
                        >
                          <path
                            stroke-linejoin="round"
                            d="m7 14l2.293-2.293a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 0 1.414 0L17 10m0 0v2.5m0-2.5h-2.5"
                          />
                          <path d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464c.974.974 1.3 2.343 1.41 4.536" />
                        </g>
                      </svg>

                      <p className="text-xs      ">Stats</p>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                      isActive
                        ? activeClassName
                        : "  h-12 flex justify-left px-4 items-center  hover:bg-secondary rounded-full  "
                    }
                  >
                    <div className="flex flex-row items-center justify-center px-1 gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-width="1.5"
                          d="M9.107 2.674A6.5 6.5 0 0 1 12 2c3.727 0 6.75 3.136 6.75 7.005v.705a4.4 4.4 0 0 0 .692 2.375l1.108 1.724c1.011 1.575.239 3.716-1.52 4.214a25.8 25.8 0 0 1-14.06 0c-1.759-.498-2.531-2.639-1.52-4.213l1.108-1.725A4.4 4.4 0 0 0 5.25 9.71v-.705c0-1.074.233-2.092.65-3.002M7.5 19c.655 1.748 2.422 3 4.5 3q.367 0 .72-.05M16.5 19a4.5 4.5 0 0 1-1.302 1.84"
                        />
                      </svg>

                      <p className="text-xs      ">Notifications</p>
                    </div>
                  </NavLink>

                  {/* <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive
                        ? activeClassName
                        : "  h-12 flex justify-left px-4 items-center  hover:bg-primary  "
                    }
                  >
                    <div className="flex flex-row items-center justify-center px-1 gap-2">
                      <CiUser className="w-5 h-5 " />
                      <p className="text-xs      ">Profile</p>
                    </div>
                  </NavLink> */}

                  <div className=" w-full p-2  pt-6">
                    <Link
                      to="/checkout"
                      className="flex flex-col flex-wrap  justify-center items-center gap-2  p-4 rounded-3xl h-32    bg-gradient-to-br from-success to-accent  hover:bg-gradient-to-br hover:from-accent hover:to-warning font-normal text-buttontext text-xs"
                    >
                      <section className="flex flex-row gap-2 justify-center items-center font-bold  ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            fill-rule="evenodd"
                            d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495a2.7 2.7 0 0 1-.408-.985a6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068a2.7 2.7 0 0 1-.985-.408a6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935m6.239 4.97a.814.814 0 0 1 0 1.15L9.32 15.832a.814.814 0 1 1-1.15-1.15l6.51-6.511a.814.814 0 0 1 1.15 0m-.033 6.543a1.085 1.085 0 1 1-2.17 0a1.085 1.085 0 0 1 2.17 0m-6.51-4.34a1.085 1.085 0 1 0 0-2.17a1.085 1.085 0 0 0 0 2.17"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <p className=" ">Limited-Time Offer!</p>
                      </section>

                      <p className=" text-center">
                        Get 20% OFF Credits, Don’t miss out, Offer ends soon!
                      </p>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 py-2    w-full    text-sm">
                <>
                  <AccountOptions />
                </>

                {/* <ThemeToggle /> */}
                {/* 
                <Link
                  to="/checkout"
                  className=" w-full px-1 pb-3 flex items-center  hover:text-complementary"
                >
                  <div className="flex flex-row gap-2 h-6  justify-center items-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 18a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-.833 2.969A7.397 6.397 0 0 1 3.03 10.833" color="currentColor" /></svg>
                    <div className="relative inline-block">
                      <p className=" text-xs      truncate ... w-full ">
                        1000 tokens left
                      </p>
                    </div>
                  </div>
                  <Balance />
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
