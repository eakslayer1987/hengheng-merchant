import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['var(--font-kanit)', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
      },
      boxShadow: {
        brand: '0 4px 20px rgba(124,58,237,.25)',
        'brand-lg': '0 8px 32px rgba(124,58,237,.40)',
        card: '0 1px 3px rgba(0,0,0,.05), 0 4px 16px rgba(0,0,0,.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,.08), 0 16px 40px rgba(0,0,0,.1)',
      },
    },
  },
  plugins: [],
}
export default config
