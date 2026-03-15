import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";

import { useEffect, useState } from "react";

import LoadingIndicator from "./components/errors/LoadingIndicator";
import NotFound from "./components/errors/NotFound";
import CustomClientErrorBoundary from "./components/errors/ErrorBoundary";
import Theme from "./components/theme/Theme";

// -------------------
// 🧩 LINKS FUNCTION
// -------------------
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Comfortaa&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Didact+Gothic&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Jost:ital,wght@0,100..900;1,100..900&family=League+Spartan:wght@100..900&family=Lexend:wght@100..900&family=Outfit:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Sacramento&family=Sankofa+Display&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Sulphur+Point:wght@300;400;700&family=Urbanist:wght@100..900&family=Varela+Round&display=swap",
  },
];

// -------------------
// 🧠 MAIN LAYOUT
// -------------------
export function Layout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Original hydration logic
    setHydrated(true);

    // ----------------------------------------------------
    // 🛡️ NEW: SECURITY CONSOLE WARNING & LOG BLOCKING
    // ----------------------------------------------------
    // This runs only in production to avoid blocking logs during development.
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      // 1. Styling for the warning message
      const titleStyle = [
        "color: #ef4444", // Red color
        "font-size: 60px",
        "font-weight: bold",
        "text-shadow: 2px 2px black",
        "padding: 10px",
      ].join(";");

      const bodyStyle = [
        "color: #333", // Dark text for readability
        "font-size: 18px",
        "padding: 10px",
      ].join(";");

      // 2. Print the warning message
      // We use setTimeout to ensure this prints after any initial React/browser logs
      setTimeout(() => {
        console.clear(); // Clear the console first
        console.log("%cStop!", titleStyle);
        console.log(
          "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or 'hack' someone's account, it is a scam and will give them access to your account.",
          bodyStyle
        );
      }, 100);

      // 3. Disable console methods
      // We define an empty function to override the real ones
      const noOp = () => { };

      // Override common logging methods
      console.log = noOp;
      console.info = noOp;
      console.warn = noOp;
      console.debug = noOp;
      console.table = noOp;
      console.trace = noOp;

      // We leave console.error enabled so that actual application
      // crashes are still reported.
    }
  }, []); // This effect runs only once on mount

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        {/* 🌓 Apply dark/light mode before hydration to prevent flash */}
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
      </head>

      <body className="bg-background text-text">
        <Theme>
          <CustomClientErrorBoundary>
            <LoadingIndicator />

            {/* Render page content after hydration */}
            {hydrated ? <main>{children}</main> : null}
          </CustomClientErrorBoundary>
        </Theme>

        <ScrollRestoration />

        {/* 🔥 Inject Firebase config from environment variables (SSR safe) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__ENV__ = ${typeof process !== "undefined"
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
      </body>
    </html>
  );
}

// -------------------
// 🚀 ROOT APP ENTRY
// -------------------
export default function App() {
  return <Outlet />;
}

// -------------------
// 🧱 ERROR BOUNDARY
// -------------------
export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-text">
        <Theme>
          {isRouteErrorResponse(error) && error.status === 404 ? (
            <div className="flex items-center justify-center min-h-screen">
              <NotFound />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
              <h1 className="text-4xl font-bold text-red-500">
                Something went wrong
              </h1>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred."}
              </p>

              {error instanceof Error && error.stack && (
                <details className="mt-4 max-w-3xl w-full bg-gray-100 dark:bg-gray-800 rounded p-4 text-left">
                  <summary className="cursor-pointer text-sm font-semibold">
                    View Stack Trace
                  </summary>
                  <pre className="mt-2 text-sm whitespace-pre-wrap text-red-600 dark:text-red-300">
                    {error.stack}
                  </pre>
                </details>
              )}

              <Link
                to="/"
                className="mt-8 rounded-md bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition-colors"
              >
                Go Home
              </Link>
            </div>
          )}
        </Theme>

        <Scripts />
      </body>
    </html>
  );
}
