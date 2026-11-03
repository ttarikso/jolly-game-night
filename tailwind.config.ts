import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pine: { 950: "#06201A", 900: "#0B2E24", 800: "#0E3B2E", 700: "#185443", 600: "#22694F" },
        cran: { 700: "#8E1B2C", 600: "#B5283B", 500: "#CC3A4C" },
        gold: { 500: "#E8B850", 400: "#F0C96E", 300: "#F6DC9C" },
        cream: { 50: "#FFFBF3", 100: "#FBF3E4", 200: "#F2E6D0" },
        ink: "#1F1B16",
      },
      fontFamily: {
        display: ["var(--font-heading)", "ui-sans-serif", "system-ui", "sans-serif"],
        script: ["var(--font-pacifico)", "cursive"],
        block: ["var(--font-heading)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-heading)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
