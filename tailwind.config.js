/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {fontFamily: {
      sans: ['"Segoe UI"', 'Roboto', 'Arial', 'sans-serif',"Cinzel","cormorant sc","cormorant garamond"],
      cormorant: ['"Cormorant Garamond"', 'serif'],
      cormorantSC: ['"Cormorant SC"', 'serif'],
    }},
  },
  plugins: [require('daisyui')],
}
