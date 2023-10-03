module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        desktop: '84vh',
        controls: '27rem',
        banner: '35rem',
        bannerLine: '3px'
      },
      zIndex: {
        100: 100
      },
      inset: {
        84: '22rem'
      },
      gridTemplateColumns: {
       '16': 'repeat(16, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out'
      },
      borderWidth: {
        '3': '3px',
      },
      width: {
        '38': '9.5rem'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
