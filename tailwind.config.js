/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryGreen: '#32CD32',
        backgroundGreen: '#E8F5E9',
        textColor: '#333333',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
