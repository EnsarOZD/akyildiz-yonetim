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
        sans: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        display: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        cormorantSC: ['"Cormorant SC"', 'serif'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
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
          "primary":         "#3b82f6",
          "primary-content": "#ffffff",
          "secondary":       "#8b5cf6",
          "accent":          "#06b6d4",
          "neutral":         "#1e293b",
          "base-100":        "#0f1623",
          "base-200":        "#151d2e",
          "base-300":        "#1c2640",
          "base-content":    "#e2e8f0",
          "--rounded-box":   "0.75rem",
          "--rounded-btn":   "0.5rem",
          "--rounded-badge": "9999px",
        },
      },
    ],
  },
}
