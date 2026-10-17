import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        text: {
          DEFAULT: "var(--text)",
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        secondary: "var(--secondary)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [require('tailwindcss-motion')],
} satisfies Config;
