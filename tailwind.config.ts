import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05060A",
        surface: "#0B0D14",
        border: "rgba(255, 255, 255, 0.08)",
        text: "#EDEEF2",
        muted: "#8A8F9C",
        accent: {
          DEFAULT: "#7C5CFF", // violet
          glow: "rgba(124, 92, 255, 0.35)",
        },
        accent2: {
          DEFAULT: "#3DE0FF", // cyan
          glow: "rgba(61, 224, 255, 0.35)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-instrument)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        display: [
          "clamp(3rem, 8vw, 8rem)",
          { lineHeight: "1.02", letterSpacing: "-0.03em" },
        ],
        h2: [
          "clamp(2rem, 4vw, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
        body: [
          "1rem",
          { lineHeight: "1.7", letterSpacing: "-0.01em" },
        ],
      },
      spacing: {
        section: "clamp(6rem, 12vw, 12rem)",
      },
      boxShadow: {
        "glow-accent": "0 0 25px -4px rgba(124, 92, 255, 0.4)",
        "glow-accent2": "0 0 25px -4px rgba(61, 224, 255, 0.4)",
      },
      transitionTimingFunction: {
        custom: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "400ms",
        base: "800ms",
        slow: "1200ms",
      },
    },
  },
  plugins: [],
};

export default config;
