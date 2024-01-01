import { defineConfig, presetIcons, presetUno } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import type { RadixColors } from 'unocss-preset-radix'
import { genCSS, generateAliases, generateColors, newPalette } from './radix'

const targetColors: RadixColors[] = ['blue', 'cyan', 'green', 'pink', 'purple', 'indigo', 'red', 'gray', 'amber', 'tomato', 'brown']

const prefix = '--un-preset-radix-'
const palette = newPalette(...targetColors)
const radixColors = generateColors(palette, prefix)
const radixAliases = generateAliases(radixColors, {})
const darkSelector = '.dark-theme'
const lightSelector = ':root, .light-theme'

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
    presetScrollbar(),
  ],
  theme: {
    colors: {
      ...radixColors,
      ...radixAliases,
    },
    fontSize: {
      tiny: ['.6rem', '0.8rem'],
    },
  },
  safelist: targetColors.map(color => [...Array(12).keys()].map(n => n + 1).map(n => [
    `bg-${color}${n}`,
  ])).flat(2),
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  preflights: [
    {
      getCSS: () => genCSS(palette, darkSelector, lightSelector, prefix),
    },
  ],
})
