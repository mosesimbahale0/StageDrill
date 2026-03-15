
import Logo from "./Logo";

export default function Loader() {
  return (
    <>
      <div className="flex flex-col gap-12 justify-center items-center min-h-screen w-full bg-primary">


        <div className=" flex flex-row  gap-2 justify-center items-center outline-none">

          <Logo />


        </div>

        <div className="flex flex-row gap-1 justify-center items-center">
          <div className=" animate-bounce-medium text-text2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
              />
            </svg>
          </div>

          <div className="  animate-bounce text-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
              />
            </svg>
          </div>

          <div className="animate-bounce-fast text-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
              />
            </svg>
          </div>
        </div>

        <p className="text-sm text-text">Just a moment...</p>
      </div>
    </>
  );
}
