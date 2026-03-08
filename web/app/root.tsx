import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import "./tailwind.css";
import { useEffect, useState } from "react";

import LoadingIndicator from "./components/errors/LoadingIndicator";
import ErrorBoundary from "./components/errors/ErrorBoundary";
import Theme from "./components/theme/Theme";
import { getSnackbar } from "~/sessions.server";
import type { SnackbarMessage } from "~/sessions.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Comfortaa&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Didact+Gothic&family=League+Spartan:wght@100..900&family=Lexend:wght@100..900&family=Outfit:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Sacramento&family=Sankofa+Display&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Sulphur+Point:wght@300;400;700&family=Urbanist:wght@100..900&family=Varela+Round&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { snackbar, headers } = await getSnackbar(request);
  return json({ snackbar }, { headers });
};

function Snackbar({ snackbar }: { snackbar: SnackbarMessage | undefined }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (snackbar) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  if (!snackbar) {
    return null;
  }

  const typeStyles = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  const Icons = {
    success: (
      <svg
        className="animate-check w-6 h-6 mr-3 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg
        className="animate-x w-6 h-6 mr-3 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
      >
        <path
          className="line1"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6"
        />
        <path
          className="line2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 6l12 12"
        />
      </svg>
    ),
    info: (
      <svg
        className="animate-scale w-6 h-6 mr-3 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="animate-shake w-6 h-6 mr-3 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-2xl text-base font-semibold flex items-center transition-all duration-300 ${
        typeStyles[snackbar.type]
      } ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {Icons[snackbar.type]}
      <span>{snackbar.message}</span>
    </div>
  );
}

export default function App() {
  const { snackbar } = useLoaderData<typeof loader>();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = savedTheme || (prefersDark ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* Animation for the success checkmark */
          @keyframes draw-check {
            from { stroke-dashoffset: 30; }
            to { stroke-dashoffset: 0; }
          }
          .animate-check path {
            stroke-dasharray: 30;
            stroke-dashoffset: 30;
            animation: draw-check 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }
    
          /* Animation for the error 'X' */
          @keyframes draw-line {
            from { stroke-dashoffset: 20; }
            to { stroke-dashoffset: 0; }
          }
          .animate-x .line1 {
            stroke-dasharray: 20;
            stroke-dashoffset: 20;
            animation: draw-line 0.2s ease-out 0.1s forwards;
          }
          .animate-x .line2 {
            stroke-dasharray: 20;
            stroke-dashoffset: 20;
            animation: draw-line 0.2s ease-out 0.3s forwards;
          }
    
          /* Animation for the info icon */
          @keyframes scale-in-pop {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale {
            animation: scale-in-pop 0.4s ease-out forwards;
          }
          
          /* Animation for the warning icon */
          @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            10% { transform: rotate(-8deg); }
            20%, 40%, 60% { transform: rotate(10deg); }
            30%, 50%, 70% { transform: rotate(-10deg); }
            80% { transform: rotate(8deg); }
            90% { transform: rotate(-8deg); }
          }
          .animate-shake {
              animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
              transform: translate3d(0, 0, 0);
          }
        `,
          }}
        />

        {/* 🔥 Inject Firebase config from environment variables (SSR safe) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__ENV__ = ${
                typeof process !== "undefined"
                  ? JSON.stringify({
                      FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
                      FIREBASE_AUTH_DOMAIN:
                        process.env.VITE_FIREBASE_AUTH_DOMAIN,
                      FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
                      FIREBASE_STORAGE_BUCKET:
                        process.env.VITE_FIREBASE_STORAGE_BUCKET,
                      FIREBASE_MESSAGING_SENDER_ID:
                        process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                      FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
                      GOOGLE_MAPS_API_KEY: process.env.VITE_GOOGLE_MAPS_API_KEY,
                    })
                  : "{}"
              };
            `,
          }}
        />

        <Scripts />
      </head>
      <body className="font-medium">
        <Theme>
          <ErrorBoundary>
            <LoadingIndicator />
            {hydrated ? (
              <>
                <main>
                  <Outlet />
                </main>
              </>
            ) : null}
          </ErrorBoundary>
        </Theme>
        <ScrollRestoration />
        <Scripts />
        <Snackbar snackbar={snackbar} />
      </body>
    </html>
  );
}
