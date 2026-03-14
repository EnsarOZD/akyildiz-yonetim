/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Segoe UI"', 'Roboto', 'Arial', 'sans-serif', "Cinzel", "cormorant sc", "cormorant garamond"],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        cormorantSC: ['"Cormorant SC"', 'serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/theme/object.js").default["light"],
          // Soft blue-gray backgrounds so cards/boxes stand out visually
          "--color-base-100": "oklch(97% 0.008 240)",
          "--color-base-200": "oklch(93% 0.012 240)",
          "--color-base-300": "oklch(88% 0.016 240)",
        },
      },
      "dark",
    ],
  },
}
