/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        softPink: '#ffb5d3',
        softBlue: '#a4c8e1',
        softYellow: '#fdf1b4',
        softPurple: '#d8c6e2',
        softGreen: '#b7eed3',
        coquettePink: '#ffd4ff',
        coquettePeach: '#ffcbcb',
        coquetteLime: '#e1ffc0'
      }
    }
  },
  plugins: []
};
