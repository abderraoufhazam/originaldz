import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf6fb',
          100: '#f3eaf6',
          200: '#e5d2ea',
          300: '#cfadd6',
          400: '#b483bd',
          500: '#9a63a3',
          600: '#7e4a88',
          700: '#63396c',
          800: '#4a2b52',
          900: '#331d3a',
          950: '#221326',
        },
        accent: {
          50: '#fdf6f0',
          100: '#fae9dc',
          200: '#f4d0b8',
          300: '#ecb18e',
          400: '#e2936a',
          500: '#d67a4c',
          600: '#c2653c',
          700: '#a14f30',
          800: '#814029',
          900: '#683525',
        },
        ink: {
          800: '#3a2a1f',
          900: '#2b1e16',
          950: '#1a120c',
        },
        ivory: {
          50: '#fbf7f1',
          100: '#f3eae0',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cairo', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px -12px rgba(74, 43, 82, 0.18)',
        lift: '0 22px 50px -20px rgba(210, 122, 76, 0.35)',
        jewel: '0 18px 45px -18px rgba(74, 43, 82, 0.45)',
      },
      backgroundImage: {
        'jewel-gradient': 'linear-gradient(135deg, #4a2b52 0%, #331d3a 55%, #221326 100%)',
        'copper-gradient': 'linear-gradient(135deg, #e2936a 0%, #d67a4c 60%, #c2653c 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
