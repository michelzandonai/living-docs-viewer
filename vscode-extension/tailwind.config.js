/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/webview/**/*.{ts,tsx}',
    '../src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
