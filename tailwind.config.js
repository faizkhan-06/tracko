/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ["Ubuntu"],
        smooch: ["Smooch"],
      },
      colors: {
        "black-100": "#111",
        "white-100": "#fff",
      },
    },
  },
  plugins: [],
};
