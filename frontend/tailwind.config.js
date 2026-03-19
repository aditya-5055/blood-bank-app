/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff5f5",
          100: "#ffe0e0",
          200: "#ffc0c0",
          300: "#ff9090",
          400: "#ff5555",
          500: "#e53e3e",
          600: "#c53030",
          700: "#9b2c2c",
          800: "#742a2a",
          900: "#4a1515",
        }
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      }
    },
  },
  plugins: [],
}