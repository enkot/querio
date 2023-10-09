import { defineConfig, presetIcons, presetUno } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'
import { presetForms } from '@julr/unocss-preset-forms'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import type { RadixColors } from 'unocss-preset-radix'
import { presetRadix } from 'unocss-preset-radix'

const palette: RadixColors[] = ['blue', 'cyan', 'green', 'pink', 'purple', 'indigo', 'red', 'gray']

export default defineConfig({
  presets: [
    presetUno({
      dark: {
        light: '.light-theme',
        dark: '.dark-theme',
      },
    }),
    presetIcons({
      prefix: '',
      collections: {
        i: FileSystemIconLoader('./src/assets/icons'),
      },
    }),
    presetRadix({
      palette,
    }),
    presetForms(),
    presetScrollbar(),
  ],
  theme: {
    colors: {
      gray: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        750: '#32323a',
        800: '#27272a',
        850: '#212124',
        900: '#18181b',
        950: '#09090b',
      },
      pink: {
        50: '#fcf3fa',
        100: '#fbe8f7',
        200: '#f9d1f0',
        300: '#f5ace2',
        400: '#ee78cc',
        500: '#e450b5',
        600: '#d6409f',
        700: '#b6207a',
        800: '#971d65',
        900: '#7e1d56',
        950: '#4d0a32',
      },
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
    fontSize: {
      tiny: ['.6rem', '0.8rem'],
    },
  },
  safelist: palette.map(color => [...Array(12).keys()].map(n => n + 1).map(n => [
    `bg-${color}${n}`,
    `bg-${color}${n}A`,
    `border-${color}${n}`,
    `border-${color}${n}A`,
    `dark:bg-${color}${n}`,
    `dark:bg-${color}${n}A`,
    `text-${color}${n}`,
    `dark:text-${color}${n}`,
    `group-hover:bg-${color}${n}`,
  ])).flat(2),
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
})
