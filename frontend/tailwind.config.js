/** @type {import('tailwindcss').Config} */
import theme from "./src/theme/customTheme.js";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme,
  plugins: [],
};
