/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app.json"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#4FC3F7',
        background: '#1a1a2e',
        gray: '#888',
        'light-gray': '#ccc',
        error: '#ff6b6b',
      }
    },
  },
  plugins: [],
}