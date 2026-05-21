import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2428",
        muted: "#5d666f",
        line: "#d8dee4",
        paper: "#f7f8f8",
        teal: "#0f766e",
        amber: "#b45309",
        moss: "#4d7c0f"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 36, 40, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
