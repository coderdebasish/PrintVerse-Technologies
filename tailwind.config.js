/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B1F4D',   // Deep navy blue
        accent: '#C41E2C',    // Red
        gold: '#D4A017',      // Gold/amber highlight
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}