const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: [
      './public/**/*.html',
      './src/**/*.html',
      './src/**/*.vue',
      './src/**/*.js',
    ],
    safelist: [
      'bg-green-400',
      'bg-green-500',
      'bg-red-500'
    ]
  },
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['SourceSansPro', 'Roboto', 'Arial', 'sans-serif'],
    },
    extend: {
      spacing: {
        '1.5': '0.375rem',
        '3.5': '0.875rem',
      },
      fontSize: {
        tiny: ['.6rem', '0.8rem'],
      },
      colors: {
        gray: {
          ...colors.coolGray,
          150: '#EBEDF0',
          250: '#DADCE1',
          550: '#616876',
          750: '#242D3D',
          825: '#181F2E',
          850: '#181F2E',
        },
        rose: colors.rose,
        operator: {
          DEFAULT: '#df51a2',
          light: '#ff80c9',
        },
        atom: {
          DEFAULT: '#925ddc',
          light: '#c59cff',
        },
        property: {
          DEFAULT: '#1f72a0',
          light: '#68c0f0',
        },
        attribute: {
          DEFAULT: '#1E943C',
          light: '#67E286',
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderRadius: ['responsive', 'first', 'last'],
      display: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
