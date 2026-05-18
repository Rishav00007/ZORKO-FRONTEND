/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',        // ← purple-600
        'primary-dark': '#6D28D9', // ← purple-700 (hover)
        dark: '#1A1A2E',
      }
    }
  },
  plugins: [],
}