/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        'neon-red': '#ff0044',
        'neon-blue': '#0099ff',
        'space-black': '#0a0a0a',
        'moon-gray': '#2a2a2a',
      },
      boxShadow: {
        'neon': '0 0 10px var(--neon-red), inset 0 0 5px var(--neon-red)',
      },
    },
  },
  plugins: [],
};