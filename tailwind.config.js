/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Manrope", "sans-serif"],
      },
      colors: {
        ink: "#10182f",
        muted: "#66718a",
        brand: "#5b6cf6",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(49, 65, 120, 0.08)",
      },
    },
  },
  plugins: [],
};
