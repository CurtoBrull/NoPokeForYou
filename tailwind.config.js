// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulseOnce: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .7 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        'pulse-once': 'pulseOnce 1s ease-in-out 1', // Pulsa una vez
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards', // Aparece desde abajo
        'spin-slow': 'spinSlow 8s linear infinite', // Gira lentamente
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards', // Aparece desde arriba
        'wiggle': 'wiggle 0.3s ease-in-out infinite', // Wiggle animado para el botón troll
      },
      boxShadow: {
        'inner-xl': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06), inset 0 4px 6px 0 rgba(0, 0, 0, 0.1)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      textShadow: {
        'sm': '0 1px 2px var(--tw-shadow-color)',
        'md': '0 2px 4px var(--tw-shadow-color)',
        'lg': '0 3px 6px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [],
};
