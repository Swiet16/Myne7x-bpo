import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f9',
          100: '#d5deee',
          200: '#aabddc',
          300: '#7f9cca',
          400: '#547bb8',
          500: '#3a6299',
          600: '#2d4d7a',
          700: '#1f3a5f',
          800: '#0B1F3A',
          900: '#091a31',
          950: '#050f1f',
        },
        teal: {
          50: '#e6fbfa',
          100: '#c2f4f2',
          200: '#85e9e6',
          300: '#43d8d3',
          400: '#1dbfb9',
          500: '#0fa3a0',
          600: '#0a807e',
          700: '#0a6563',
          800: '#0b4f4e',
          900: '#0a4241',
        },
        accent: {
          DEFAULT: '#14b8a6',
          light: '#2dd4bf',
          dark: '#0d9488',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0B1F3A 0%, #1f3a5f 100%)',
        'gradient-teal': 'linear-gradient(135deg, #0fa3a0 0%, #2dd4bf 100%)',
        'gradient-hero': 'linear-gradient(135deg, #050f1f 0%, #0B1F3A 50%, #1f3a5f 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(11, 31, 58, 0.08)',
        'card': '0 8px 30px rgba(11, 31, 58, 0.12)',
        'glow': '0 0 30px rgba(20, 184, 166, 0.3)',
        'navy': '0 8px 30px rgba(5, 15, 31, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
