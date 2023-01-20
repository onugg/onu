/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'discord': '#7289da',

        'theme-100': '#7e7fa0',
        'theme-200': '#7e7fa0',
        'theme-300': '#252740',
        'theme-400': '#26263e',

        'theme-500': '#24273e',
        'theme-600': '#1f2037',
        'theme-700': '#424562',
        'theme-800': '#1e1e36',
        'theme-900': '#121320',

      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
};
