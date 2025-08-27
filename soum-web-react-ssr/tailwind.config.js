/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/client/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["IBM Plex Sans Arabic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
