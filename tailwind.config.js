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
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        cormorantSC: ['"Cormorant SC"', 'serif'],
      },
      colors: {
        brand: {
          50:  '#f0f7fc',
          100: '#e0f0fa',
          200: '#bae2f5',
          300: '#7cc9ec',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#16283a',
        },
        surface: {
          light: '#f0f7fc',
          DEFAULT: '#f6fafd',
        }
      },
      boxShadow: {
        'card':   '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-md':'0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'card-lg':'0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'inner-sm':'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'glow-blue': '0 0 20px rgb(2 132 199 / 0.25)',
        'glow-sm':   '0 0 10px rgb(2 132 199 / 0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'scale-in':   'scaleIn 0.15s ease-out',
        'blob':       'blob 7s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%':  { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
      },
    },
  },
  plugins: [require("daisyui")],
  // NOT: DaisyUI 5 bu bloğu (v4 API) okumaz — gerçek tema tokenları
  // src/style.css içindeki [data-theme] CSS değişken bloğunda tanımlı.
  // Buradaki değerler v4'e dönülmesi hâlinde geçerli olacak referanstır.
  daisyui: {
    darkTheme: false,
    themes: [
      {
        light: {
          ...require("daisyui/theme/object.js").default["light"],
          "primary":           "#0284c7",
          "primary-content":   "#ffffff",
          "secondary":         "#0ea5e9",
          "secondary-content": "#ffffff",
          "accent":            "#059669",
          "accent-content":    "#ffffff",
          "neutral":           "#5a7186",
          "neutral-content":   "#ffffff",
          "base-100":          "#ffffff",
          "base-200":          "#f0f7fc",
          "base-300":          "#d9e7f2",
          "base-content":      "#16283a",
          "success":           "#059669",
          "warning":           "#d97706",
          "error":             "#dc2626",
          "info":              "#0ea5e9",
          "--rounded-box":     "0.875rem",
          "--rounded-btn":     "0.625rem",
          "--rounded-badge":   "9999px",
        },
      },
    ],
  },
}
