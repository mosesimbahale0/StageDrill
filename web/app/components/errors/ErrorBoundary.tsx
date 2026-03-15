import React from "react";
import { Link } from "@remix-run/react";

import Logo from "../common/Logo";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, is404: false };

  static getDerivedStateFromError(error) {
    const is404 = error?.message?.includes("404");
    return { hasError: true, error, is404 };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      `[${new Date().toISOString()}] Caught by ErrorBoundary:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.state.is404) {
        return (
          <div
            role="alert"
            className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-primary text-text2"
          >
            <div className="  flex flex-row  gap-1 justify-center items-center ">
              <div className="  flex flex-row  gap-2 justify-center items-center outline-none">
                <Logo />
              </div>
            </div>
            <h1 className="text-xl text-red-500 mb-2">Page Not Found (404)</h1>
            <p className="text-sm mb-4">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <div className="flex gap-4">
              <a href="/" className="btn btn-primary">
                Go Home
              </a>
              <a href="/support" className="btn btn-secondary">
                Contact Support
              </a>
            </div>
          </div>
        );
      }

      const errorMessage =
        this.state.error?.message ||
        "An unexpected error occurred. Please try again later.";

      return (
        // <div
        //   role="alert"
        //   className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-primary text-text2"
        // >
        //              <div className="  flex flex-row  gap-1 justify-center items-center ">
        //         <div className="  flex flex-row  gap-2 justify-center items-center outline-none">
        //             <img alt="logo" src="/assets/logo2.png" className="h-20 w-20" />
        //         </div>
        //     </div>
        //   <h2 className="text-xl text-red-500 mb-2">We encountered an error</h2>
        //   <p className="text-sm mb-4">{errorMessage}</p>
        //   <div className="flex gap-4">
        //     <a href="/" className="btn btn-primary">Go Home</a>
        //     <a href="/support" className="btn btn-secondary">Contact Support</a>
        //   </div>
        // </div>

        <div className="w-full min-h-screen bg-background flex flex-col gap-8 items-center justify-center p-8">
          <div className="  flex flex-row  gap-1 justify-center items-center ">
            <div className="  flex flex-row  gap-2 justify-center items-center outline-none w-full ">
              <Logo />
            </div>
          </div>

          <p>We apologize for this error</p>

          <div className="text-danger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 16.462q.262 0 .439-.177q.176-.177.176-.439q0-.261-.177-.438T12 15.23t-.438.177t-.177.438t.177.439t.438.177m-.5-3.308h1v-6h-1zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"
              />
            </svg>
          </div>

          <p className="text-sm ">
            Please try refreshing the page, If the problem persists, please
            contact support
          </p>

          <p className="  text-xs">Error loading this Section!</p>

          <p className="text-xs text-red-300">Details : {errorMessage}</p>

          <div className="flex flex-row gap-2">

            <a
              href="/"
              className=" bg-accent hover:bg-complementary px-10 py-4 rounded-full text-text group inline-flex text-sm"
            >
              Home
            </a>





            <a
              href="/support"
              className=" bg-accent hover:bg-complementary px-10 py-4 rounded-full text-text group inline-flex text-sm"
            >
              Contact support
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
