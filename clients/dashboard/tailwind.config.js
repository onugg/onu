/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#fffefe',
        cream: '#f4f5fd',
        primary: '#ffe6d1',
        secondary: '#495bba',
        tertiary: '#feda8f',
        quaternary: '#fe91a4',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
