import { useNavigation, Link } from "@remix-run/react";

import Logo from "../common/Logo";

export default function LoadingIndicator() {
  const navigation = useNavigation();

  return navigation.state === "loading" ? (
    <>
      <div className="flex flex-col gap-12 justify-center items-center min-h-screen w-full bg-primary">
        <div className=" flex flex-row  gap-2 justify-center items-center outline-none">

        </div>

        <Logo />


        <p className="text-sm text-text">Just a moment...</p>

        <div className="flex flex-row  justify-center items-center">
          <div className=" animate-bounce-medium text-text2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
              />
            </svg>
          </div>

          <div className="  animate-bounce  text-text2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
              />
            </svg>
          </div>

          <div className="animate-bounce-fast  text-text2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  ) : null;
}

export function CatchBoundary() {
  return (
    <div className="h-screen flex items-center justify-center">
      <p>Error: Something went wrong during navigation.</p>
      <Link to="/" className="text-blue-500 underline">
        Go back home
      </Link>
    </div>
  );
}
