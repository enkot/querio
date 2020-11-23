const colors = require('tailwindcss/colors')

module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  experimental: {
    applyComplexClasses: true,
  },
  purge: {
    options: {
      whitelist: ['mode-dark'],
    },
  },
  theme: {
    customForms: theme => ({
      sm: {
        'input, textarea, multiselect, select': {
          fontSize: theme('fontSize.xs'),
          padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
        },
      },
    }),
    extend: {
      spacing: {
        '1.5': '0.375rem',
      },
      fontSize: {
        tiny: '.6rem',
      },
      colors: {
        gray: {
          ...colors.gray,
          '250': '#E7ECF0',
          '550': '#8C97A6',
          '825': '#282F40',
          '850': '#212735',
        },
        operator: {
          default: '#df51a2',
          light: '#ff80c9',
        },
        atom: {
          default: '#925ddc',
          light: '#c59cff',
        },
        property: {
          default: '#1f72a0',
          light: '#68c0f0',
        },
        attribute: {
          default: '#1E943C',
          light: '#67E286',
        },
      },
    },
  },
  variants: {
    backgroundColor: ['dark', 'dark-hover', 'hover'],
    borderColor: ['dark', 'hover', 'dark-focus'],
    divideColor: ['dark', 'hover', 'dark-focus'],
    textColor: ['dark', 'dark-hover', 'hover'],
    borderRadius: ['responsive', 'first', 'last'],
  },
  plugins: [
    require('tailwindcss-dark-mode')(),
    require('@tailwindcss/custom-forms'),
  ],
}
