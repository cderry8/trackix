import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dim: 'rgb(var(--accent-dim) / <alpha-value>)',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-dark': '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to right, rgb(var(--grid-line) / 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--grid-line) / 0.45) 1px, transparent 1px)',
      },
      animation: {
        'grid-drift': 'gridDrift 80s linear infinite',
        'glow-pulse': 'glowPulse 18s ease-in-out infinite',
        float: 'floaty 22s ease-in-out infinite',
      },
      keyframes: {
        gridDrift: {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '120px 120px, 120px 120px' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1) translate(0,0)' },
          '50%': { opacity: '0.55', transform: 'scale(1.05) translate(2%, -1%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '33%': { transform: 'translateY(-8px) translateX(4px)' },
          '66%': { transform: 'translateY(4px) translateX(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
