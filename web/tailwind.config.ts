import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Urbanist" ',
          '"Plus Jakarta Sans " ',
          '"Outfit" ',
          '"Poppins" ',
        ],
      },
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        tertiary: "var(--tertiary-color)",
        quaternary: "var(--quaternary-color)",
        background: "var(--background-color)",
        text: "var(--text1-color)",
        text2: "var(--text2-color)",
        text3: "var(--text3-color)",
        success: "var(--success-color)",
        error: "var(--error-color)",
        warning: "var(--warning-color)",
        danger: "var(--danger-color)",
        danger2: "var(--danger2-color)",
        info: "var(--info-color)",
        accent: "var(--accent-color)",
        disabled: "var(--disabled-color)",
        complementary: "var(--complementary-color)",
        active: "var(--active-color)",
        transparent: "var(--transparent-color)",
        buttontext: "var(--buttontext-color)",
      },
    },
  },

  darkMode: "class", // Enable dark mode with the 'class' strategy
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        // Light Mode Palette (Google Material Design Inspired)
        ":root": {
          // --- System Colors: Google's standard status colors ---
          "--success-color": "#1E8E3E", // Green for success
          "--error-color": "#D93025", // Red for errors
          "--warning-color": "#F9AB00", // Yellow for warnings
          "--danger-color": "#C5221F", // A darker red for destructive actions
          "--info-color": "#1A73E8", // Blue for informational messages

          // --- Brand & Interactive Colors ---
          "--accent-color": "#FF5F00",
          "--disabled-color": "#9CA3AF",
          "--complementary-color": "#D95100", // Darker shade for hover/gradients
          // --- Surface Colors: Hierarchical grays, similar to Chrome's UI ---
          "--background-color": "#F8F9FA", // Main app background, very light gray
          "--primary-color": "#FFFFFF", // Card backgrounds and main content areas
          "--secondary-color": "#F1F3F4", // A subtle off-white for secondary panels/toolbars
          "--tertiary-color": "#DADCE0", // Borders and dividers
          "--quaternary-color": "#FFFFFF", // Retained for flexibility

          // --- Text Colors: High contrast and readable ---
          "--text1-color": "#202124", // Main heading/body text
          "--text2-color": "#5F6368", // Secondary, less important text
          "--text3-color": "#80868B", // Placeholder or disabled text

          // --- Misc ---
          "--transparent-color": "rgba(255, 255, 255, 0.5)",
          "--buttontext-color": "#FFFFFF", // White text provides high contrast on the orange accent
        },

        // Dark Mode Palette (Google Material Design Inspired)
        // Dark mode
        ".dark": {
          "--success-color": "#61C453",
          "--error-color": "#EF4444",
          "--warning-color": "#E65100", // yellow-500
          "--danger-color": "#C62828", // red-800
          "--danger2-color": "#FF0000", // red-500

          "--info-color": "#3B82F6",
          "--accent-color": "#FF5F00",
          "--disabled-color": "#4B5563",
          "--complementary-color": "#FF8A33", // Lighter shade for dark mode
          "--active-color": "#E65500", // Slightly darker orange for active state
          "--primary-color": "#131316",
          "--secondary-color": "#212126",
          "--tertiary-color": "#2B2B2E",
          "--quaternary-color": "#343438",
          "--background-color": "#000000", // dark background color
          "--text1-color": "#FFFFFF",
          "--text2-color": "#9CA3AF",
          "--text3-color": "#6B7280",
          "--transparent-color": "rgba(0,0,0,0.5)",
          "--buttontext-color": "#FFFFFF", // White text on orange accent
        },
      });
    }),

    // Typography
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar"),
  ],
};

export default config;
