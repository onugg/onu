/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#3454D1",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
