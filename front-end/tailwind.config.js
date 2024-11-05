/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'primary-color': '#0F2348',
        'secondary-color': '#BA9D6E',
      },
      fontFamily: {
        roboto: ['roboto']
      }
    },
  },
  plugins: [],
};
