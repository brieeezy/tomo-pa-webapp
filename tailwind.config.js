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
        ink: "#392F5A",
        muted: "#746F80",
        brand: "#FF8811",
        jasmine: "#F4D06F",
        floral: "#FFF8F0",
        aqua: "#9DD9D2",
        space: "#392F5A",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(57, 47, 90, 0.09)",
      },
    },
  },
  plugins: [],
};
