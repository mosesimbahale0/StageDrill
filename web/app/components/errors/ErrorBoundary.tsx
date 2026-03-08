import React from "react";

import Logo from "~/components/common/Logo";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, is404: false };
  }

  static getDerivedStateFromError(error) {
    // Check if the error is a 404
    const is404 = error.message && error.message.includes("404");
    return { hasError: true, error, is404 };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.state.is404) {
        return (
          <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-primary text-text2">
            <Logo />
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

      const errorMessage = this.state.error?.message || "Something went wrong.";

      return (
        <>
          <div className="w-full min-h-screen bg-primary flex flex-col gap-8 items-center justify-center p-8">
            <div className="  flex flex-row  gap-1 justify-center items-center ">
              <div className="  flex flex-row  gap-2 justify-center items-center outline-none">
                <Logo />
              </div>
            </div>

            <p className="text-xl ">We apologize for this error</p>

            <div className="text-danger">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="64px"
                viewBox="0 -960 960 960"
                width="64px"
                fill="currentColor"
              >
                <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
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
                className=" bg-accent hover:bg-complementary px-10 py-4 rounded-full text-buttontext group inline-flex text-sm"
              >
                Go Home
              </a>

              <a
                href="/support"
                className=" bg-accent hover:bg-complementary px-10 py-4 rounded-full text-buttontext group inline-flex text-sm"
              >
                Contact support
              </a>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
