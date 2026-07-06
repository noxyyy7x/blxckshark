/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  safelist: [
    { pattern: /from-(neutral|sky|red|yellow|amber|blue)-(300|400|500|600|700|800|900)/ },
    { pattern: /via-(neutral|sky|red|yellow|amber|blue)-(300|400|500|600|700|800|900)/ },
    { pattern: /to-(neutral|sky|red|yellow|amber|blue|black)(-(300|400|500|600|700|800|900))?/ },
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#141414',
        border: '#2a2a2a',
        muted: '#888888',
      },
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
