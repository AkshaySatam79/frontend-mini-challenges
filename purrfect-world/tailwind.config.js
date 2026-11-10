/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'Nunito', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        blush: { 50: '#fff5f8', 100: '#ffe4ee', 200: '#ffc9dd', 300: '#ffa3c4', 400: '#ff78a8', 500: '#f4568d' },
        lav: { 50: '#f7f3ff', 100: '#ece4ff', 200: '#d9c9ff', 300: '#bfa3ff', 400: '#a37cf5', 500: '#8559e0' },
        cream: '#fff9f0',
        peach: { 100: '#ffe8da', 200: '#ffd2b8', 300: '#ffb98f' },
        night: { 900: '#15111f', 800: '#1d1830', 700: '#2a2342' },
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(163, 124, 245, 0.35)',
        pink: '0 10px 30px -10px rgba(244, 86, 141, 0.45)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0) rotate(var(--r,0deg))' }, '50%': { transform: 'translateY(-22px) rotate(var(--r,0deg))' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        blob: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(30px,-40px) scale(1.12)' } },
        wiggle: { '0%,100%': { transform: 'rotate(-6deg)' }, '50%': { transform: 'rotate(6deg)' } },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        blob: 'blob 14s ease-in-out infinite',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
