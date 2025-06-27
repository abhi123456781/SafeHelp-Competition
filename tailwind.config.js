/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0047AB',
        primaryDark: '#002f6c',
        background: '#ffffff',
      },
    },
  },
  plugins: [],
}