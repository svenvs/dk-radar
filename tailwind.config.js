/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "site/**/*.njk",
    //"./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ds-blue': '#082040',
        'ds-blue-dark': '#031326',
        'ds-orange-dark': '#D94929',
        'ds-orange': '#F28A2E',
        'ds-yellow': '#F2C84B',
      },
    },
  },
  plugins: [],
}