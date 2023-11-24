import { defineConfig, presetIcons, presetUno } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import type { RadixColors } from 'unocss-preset-radix'
import { genCSS, generateAliases, generateColors, newPalette } from './radix'

const targetColors: RadixColors[] = ['blue', 'cyan', 'green', 'pink', 'purple', 'indigo', 'red', 'gray', 'crimson', 'amber', 'orange', 'plum', 'ruby', 'tomato']

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
    // presetRadix({
    //   palette,
    //   extend: true,
    // }),
    // presetForms(),
    presetScrollbar(),
  ],
  theme: {
    colors: {
      // cmblue: colors.blue,
      // cmcyan: colors.cyan,
      // cmgreen: colors.green,
      // cmpink: colors.pink,
      // cmpurple: colors.purple,
      // cmindigo: colors.indigo,
      // cmred: colors.red,
      // cmgray: colors.gray,
      // cmfuchsia: colors.fuchsia,
      ...radixColors,
      ...radixAliases,
    },
    fontSize: {
      tiny: ['.6rem', '0.8rem'],
    },
  },
  safelist: targetColors.map(color => [...Array(12).keys()].map(n => n + 1).map(n => [
    `bg-${color}${n}`,
    `bg-${color}${n}A`,
    `border-${color}${n}`,
    `border-${color}${n}A`,
    `dark:border-${color}${n}A`,
    `border-x-${color}${n}`,
    `border-x-${color}${n}A`,
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
  preflights: [
    {
      getCSS: () => genCSS(palette, darkSelector, lightSelector, prefix),
    },
  ],
})
