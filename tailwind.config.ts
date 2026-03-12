import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['var(--font-kanit)', 'Kanit', 'Sarabun', 'sans-serif'],
        sans:  ['var(--font-kanit)', 'Kanit', 'Sarabun', 'sans-serif'],
      },
      colors: {
        brand: {
          red:   '#fd1803',
          red2:  '#c01002',
          dark:  '#1C1C2E',
          navy:  '#2D2D44',
        },
      },
      fontSize: {
        '7xl': ['4.5rem',  { lineHeight:'1.05', letterSpacing:'-0.02em' }],
        '8xl': ['6rem',    { lineHeight:'1',    letterSpacing:'-0.03em' }],
        '9xl': ['8rem',    { lineHeight:'0.95', letterSpacing:'-0.04em' }],
      },
      backgroundImage: {
        'thai-flag': `
          radial-gradient(ellipse 55% 80% at 0% 50%,   rgba(253,24,3,0.40)  0%, transparent 58%),
          radial-gradient(ellipse 45% 70% at 100% 50%,  rgba(30,64,175,0.32) 0%, transparent 58%),
          radial-gradient(ellipse 60% 60% at 50% 50%,   rgba(255,255,255,1)  0%, #f4f4f8 100%)
        `,
        'dark-hero': `
          radial-gradient(ellipse 70% 60% at 0% 0%, rgba(253,24,3,.15) 0%, transparent 60%),
          linear-gradient(160deg, #1C1C2E 0%, #2D2D44 60%, #3a1a1a 100%)
        `,
      },
      boxShadow: {
        card:   '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.10)',
        red:    '0 8px 28px rgba(253,24,3,0.40)',
        'red-lg': '0 12px 36px rgba(253,24,3,0.55)',
      },
      animation: {
        'blob-float': 'blobFloat 8s ease-in-out infinite alternate',
        'fade-up': 'fadeUp 0.6s ease both',
      },
    },
  },
  plugins: [],
}
export default config
