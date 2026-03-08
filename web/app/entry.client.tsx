import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { AuthProvider } from "~/authContext"; // Import the AuthProvider

// Immediately apply the theme from local storage on client-side hydration
function applyStoredTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  } else {
    // Fallback to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }
}

// Apply the theme immediately on hydration
applyStoredTheme();




startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <AuthProvider>
        <RemixBrowser />
      </AuthProvider>
    </StrictMode>
  );
});
