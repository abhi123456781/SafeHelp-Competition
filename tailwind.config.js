/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    'hover:bg-[#e6f0ff]',
    'bg-[#e6f0ff]',
    'bg-[#0047AB]',
    'text-[#0047AB]',
    'border-[#0047AB]',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0047AB',
        primaryDark: '#002f6c',
        background: '#e6f0ff',
      },
    },
  },
  plugins: [],
};