/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#17141a",
        secondary: "#312e3b",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
