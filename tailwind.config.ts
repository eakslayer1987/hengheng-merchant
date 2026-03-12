import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red:  '#fd1803',
          red2: '#e01502',
          dark: '#1C1C2E',
          navy: '#2D2D44',
        },
      },
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'],
      },
      boxShadow: {
        card:   '0 2px 20px rgba(0,0,0,0.08)',
        orange: '0 4px 20px rgba(253,24,3,0.4)',
      },
    },
  },
  plugins: [],
}
export default config
