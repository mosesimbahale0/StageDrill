import { useNavigation, Link } from "@remix-run/react";
import Logo from "../common/Logo";

export default function LoadingIndicator() {
  const navigation = useNavigation();

  return navigation.state === "loading" ? (
    <div className="min h-screen w-screen bg-primary  z-20 fixed bottom-0 left-0 top-0 right-0 flex flex-col justify-around items-center gap-8">
      <div className="flex flex-col gap-12 justify-center items-center text-text2">
        <section className="flex flex-row items-center gap-2">
          <Logo />
        </section>

        <div className="flex flex-row items-center gap-2 text-text3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path
                stroke-dasharray="16"
                stroke-dashoffset="16"
                d="M12 3c4.97 0 9 4.03 9 9"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.3s"
                  values="16;0"
                />
                <animateTransform
                  attributeName="transform"
                  dur="1.5s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </path>
              <path
                stroke-dasharray="64"
                stroke-dashoffset="64"
                stroke-opacity="0.3"
                d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="1.2s"
                  values="64;0"
                />
              </path>
            </g>
          </svg>
          <p className="text-sm">Just a moment...</p>
        </div>
      </div>
    </div>
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
