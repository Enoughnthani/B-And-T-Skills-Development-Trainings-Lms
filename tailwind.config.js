// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false, // This disables Tailwind's base/reset styles
  },
  theme: {
    extend: {
      // ... your existing extensions
      transitionDuration: {
        '5000': '5000ms',
        '2000': '2000ms',
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
      keyframes: {
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'show-chat-box': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        'hide-chat-box': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' }
        },
        'blink-chevron': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'pop-in': {
          '0%': { transform: 'translateX(40vh)' },
          '25%': { transform: 'translateX(-10vh)' },
          '50%': { transform: 'translateX(0)' },
          '75%': { transform: 'translateX(-5vh)' },
          '100%': { transform: 'translateX(0)' }
        },
        'pop-out': {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5vh)' },
          '50%': { transform: 'translateX(0)' },
          '75%': { transform: 'translateX(-10vh)' },
          '100%': { transform: 'translateX(100vh)' }
        },
        'borderMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'fade-in-left': 'fade-in-left 0.8s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.8s ease-out forwards',
        'show-chat-box': 'show-chat-box 0.3s ease-in-out forwards',
        'hide-chat-box': 'hide-chat-box 0.3s ease-in-out forwards',
        'blink-chevron': 'blink-chevron 0.4s ease-in-out infinite',
        'pop-in': 'pop-in 2s ease-in-out forwards',
        'pop-out': 'pop-out 2s ease-in-out forwards',
        'borderMove': 'borderMove 4s linear infinite',
      },
    },
  },
  plugins: [],
}