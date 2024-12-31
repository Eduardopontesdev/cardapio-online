/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily:{
        "sans": ['Poppins', 'sans-serif']
      },
      backgroundImage:{
        "home": "url('/img/bg.png')"
      }
    },
  },
  plugins: [],
}

