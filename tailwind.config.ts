import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        felt: '#0f1a0f',
        deep: '#0a0a0a',
        gold: '#c8a96e',
        'gold-dim': '#8a6f3e',
        ivory: '#f0ead8',
        muted: '#7a7060',
        'card-bg': '#1a1a1a',
        'card-border': '#2a2520',
        danger: '#8b1a1a',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Noto Serif JP', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        cardReveal: {
          from: { opacity: '0', transform: 'rotateY(90deg) translateY(20px)' },
          to: { opacity: '1', transform: 'rotateY(0deg) translateY(0)' },
        },
        questionIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'card-reveal': 'cardReveal 0.8s ease-out forwards',
        'question-in': 'questionIn 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
