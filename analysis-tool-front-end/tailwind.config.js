module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        desktop: '84vh',
        controls: '27rem'
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
       }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
