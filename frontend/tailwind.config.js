/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#0f1117',
        steel: '#1e3a5f',
        orange: '#ff6b2b',
        silver: '#c0c8d8',
        offwhite: '#f4f6f9',
        'steel-dark': '#12253f',
        'orange-light': '#ff8c5a',
        'orange-glow': 'rgba(255,107,43,0.3)',
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        source: ['Source Sans 3', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spin-reverse 10s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'grid-pan': 'grid-pan 20s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,107,43,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255,107,43,0.8)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'grid-pan': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
      backgroundImage: {
        'blueprint-grid': "linear-gradient(rgba(30,58,95,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,95,0.4) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-40': '40px 40px',
      },
      boxShadow: {
        'orange-glow': '0 0 20px rgba(255,107,43,0.5)',
        'steel-glow': '0 0 20px rgba(30,58,95,0.5)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
