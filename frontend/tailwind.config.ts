import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        rose: "#C2185B",
        gold: "#F9A825",
        "deep-bg": "#1A1A2E",
        cream: "#FFF8F0",
        "electric-pink": "#FF4081",
        champagne: "#F5E6CA",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      maxWidth: {
        mobile: "430px",
      },
    },
  },
  plugins: [],
};
export default config;
