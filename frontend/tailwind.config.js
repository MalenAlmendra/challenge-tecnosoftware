module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    colors: {
      brand: {
        primary: '#c1292e',
        background: '#ffffff',
        active: '#c1292e',
        headerBackground: '#e2e1e1',
      },
      primary: {
        red: '#c1292e',
        white: '#ffffff',
      },
      hover: {
        red: '#c1292e',
        white: '#f2f2f2',
      },
    },
    fontFamily: {
      sans: [
        'Roboto',
        'Helvetica',
        'Helvetica Neue',
        'Nunito Sans',
        'sans-serif',
      ],
    },
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
