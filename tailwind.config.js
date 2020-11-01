const { colors } = require('tailwindcss/defaultTheme')

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
      },
    },
  },
  variants: {
    backgroundColor: ['dark', 'dark-hover', 'hover'],
    borderColor: ['dark', 'hover', 'dark-focus'],
    textColor: ['dark', 'dark-hover', 'hover'],
    borderRadius: ['responsive', 'first', 'last'],
  },
  plugins: [
    require('@tailwindcss/ui'),
    require('tailwindcss-dark-mode')(),
    require('@tailwindcss/custom-forms'),
  ],
}
