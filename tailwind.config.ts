import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1E",
        text: "#F0F4FF",
        muted: "#94A3B8",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        primary: {
          DEFAULT: "#7C3AED",
          hover: "#6D28D9",
        },
        secondary: {
          DEFAULT: "#5C6BC0",
          hover: "#4C5AA8",
        },
        darkCard: "rgba(255, 255, 255, 0.05)",
        darkBorder: "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        syne: ["var(--font-syne)", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
