import React from "react";

// A simple SVG Logo component to replace the one from your import
// It uses Tailwind classes to inherit text color
import Logo from "../common/Logo";

// Your NotFound component, enhanced
function NotFound() {
  return (
    // Use bg-background for the main page background
    <div className="min-h-screen w-screen bg-background flex flex-col justify-center items-center p-4 font-sans">
      {/* Main content container with fade-in animation */}
      <div className="flex flex-col justify-center items-center gap-6 text-center animate-fade-in-up">
        <Logo />

        <div className="flex flex-col gap-2">
          {/* Large, prominent 404 text using text-text */}
          <h1 className="text-9xl font-extrabold text-text tracking-tighter">
            404
          </h1>

          {/* Page title using text-text2 */}
          <h2 className="text-3xl font-semibold text-text2">Page Not Found</h2>

          {/* Helper text using text-text3 */}
          <p className="text-lg text-text3 max-w-md mt-2">
            Oops! It seems like the page you're looking for has taken a detour.
            Let's get you back on track.
          </p>
        </div>

        {/* "Go Home" button using your accent and buttontext colors */}
        <a
          href="/" // In a real app, this would be "/" or handled by a router
          className="mt-6 px-6 py-3 bg-accent text-buttontext font-semibold rounded-lg shadow-md hover:bg-complementary transition-colors duration-200"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}

// Main App component to render the NotFound page
export default function App() {
  // We assume the Tailwind CSS variables are loaded in the environment
  // This component just acts as the entry point to show your NotFound page
  return <NotFound />;
}
