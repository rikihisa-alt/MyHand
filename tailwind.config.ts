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
        // Splat palette
        'ink-bg': '#1a1a2e',
        'ink-dark': '#0f0f23',
        'ink-blue': '#00D4FF',
        'ink-magenta': '#FF2E8B',
        'ink-lime': '#BFFF00',
        'ink-yellow': '#FFE135',
        'ink-orange': '#FF6B35',
        'ink-purple': '#A855F7',
        'ink-card': '#2a2a4a',
        'ink-border': '#3a3a5a',
        'ink-text': '#f0f0ff',
        'ink-muted': '#8888aa',
      },
      fontFamily: {
        display: ['M PLUS Rounded 1c', 'Kosugi Maru', 'sans-serif'],
        body: ['M PLUS Rounded 1c', 'Kosugi Maru', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        splat: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        bounce_in: {
          '0%': { transform: 'scale(0.3) translateY(40px)', opacity: '0' },
          '50%': { transform: 'scale(1.05) translateY(-10px)', opacity: '1' },
          '70%': { transform: 'scale(0.95) translateY(5px)' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        ink_drip: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'top' },
        },
        slide_up: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,212,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,212,255,0.6)' },
        },
      },
      animation: {
        'splat': 'splat 0.5s cubic-bezier(0.68,-0.55,0.265,1.55) forwards',
        'bounce-in': 'bounce_in 0.6s cubic-bezier(0.68,-0.55,0.265,1.55) forwards',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 0.3s ease-in-out',
        'ink-drip': 'ink_drip 0.4s ease-out forwards',
        'slide-up': 'slide_up 0.5s ease-out forwards',
        'pulse-glow': 'pulse_glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
