/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './dev/**/*.{ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ldv: {
          bg: 'var(--ldv-bg, #ffffff)',
          'bg-secondary': 'var(--ldv-bg-secondary, #f8fafc)',
          'bg-hover': 'var(--ldv-bg-hover, #f1f5f9)',
          text: 'var(--ldv-text, #0f172a)',
          'text-secondary': 'var(--ldv-text-secondary, #64748b)',
          border: 'var(--ldv-border, #e2e8f0)',
          accent: 'var(--ldv-accent, #3b82f6)',
          'accent-light': 'var(--ldv-accent-light, #eff6ff)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
