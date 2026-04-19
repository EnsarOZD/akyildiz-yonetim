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
          50:  '#eef1ff',
          100: '#e0e5ff',
          200: '#c7cfff',
          300: '#a3aeff',
          400: '#8494ff',
          500: '#6b8aff',
          600: '#5270f0',
          700: '#4358d8',
          800: '#3847af',
          900: '#313f8a',
        },
        surface: {
          light: '#f1f5f9',
          DEFAULT: '#f8fafc',
        }
      },
      boxShadow: {
        'card':   '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-md':'0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'card-lg':'0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'inner-sm':'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'glow-blue': '0 0 20px rgb(59 130 246 / 0.3)',
        'glow-sm':   '0 0 10px rgb(59 130 246 / 0.2)',
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
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/theme/object.js").default["light"],
          "primary":         "#2563eb",
          "primary-content": "#ffffff",
          "secondary":       "#7c3aed",
          "accent":          "#0891b2",
          "neutral":         "#374151",
          "base-100":        "#ffffff",
          "base-200":        "#f1f5f9",
          "base-300":        "#e2e8f0",
          "base-content":    "#1e293b",
          "--rounded-box":   "0.75rem",
          "--rounded-btn":   "0.5rem",
          "--rounded-badge": "9999px",
        },
      },
      {
        dark: {
          ...require("daisyui/theme/object.js").default["dark"],
          "primary":         "#6b8aff",
          "primary-content": "#f1f3f9",
          "secondary":       "#93c5fd",
          "accent":          "#5eead4",
          "neutral":         "#1c2238",
          "base-100":        "#0f1322",
          "base-200":        "#080b14",
          "base-300":        "#151a2e",
          "base-content":    "#f1f3f9",
          "success":         "#5eead4",
          "warning":         "#fcd34d",
          "error":           "#fb7185",
          "info":            "#93c5fd",
          "--rounded-box":   "0.75rem",
          "--rounded-btn":   "0.5rem",
          "--rounded-badge": "9999px",
        },
      },
    ],
  },
}
