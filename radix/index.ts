import * as radix from '@radix-ui/colors'
import type { RadixColors, RadixScales, RadixSteps } from './config'

type Scale = {
  readonly [key in RadixSteps]: string;
}

type Palette = [string, Color][]

interface Color {
  light: Scale
  lightAlpha: Scale
  dark: Scale
  darkAlpha: Scale
}

export type ColorAliases = Record<string, RadixColors>

function getScale(name: keyof typeof radix): Scale {
  const rawScale = radix[name as RadixScales] as Record<string, string>

  const keyValues = Object.keys(rawScale).map((key) => {
    // rome-ignore lint/style/noNonNullAssertion: We know the source object here
    const parsedKey = key.match(/.*?(\d+)/)![1]
    return [parseInt(parsedKey), rawScale[key]]
  })

  return Object.fromEntries(keyValues)
}

export function getColor(name: RadixColors): Color {
  return {
    light: getScale(name),
    lightAlpha: getScale(`${name}A`),
    dark: getScale(`${name}Dark`),
    darkAlpha: getScale(`${name}DarkA`),
  }
}

function fg(color: string) {
  if (['sky', 'mint', 'lime', 'yellow', 'amber'].includes(color))
    return 'black'

  return 'white'
}

export function generateColors(palette: Palette, prefix: string) {
  const colors: Record<string, Record<number, string>> = {}

  function generateColor(_name: string, isAlpha: boolean) {
    const shades: Record<string, string> = {}
    const name = isAlpha ? `${_name}A` : _name

    for (let shade = 1; shade <= 12; shade++) {
      shades[shade] = `var(${prefix}${name}${shade})`
      shades[`${shade}A`] = `var(${prefix}${name}${shade}A)`
    }

    if (!isAlpha)
      shades.fg = `var(${prefix}${name}-fg)`

    colors[name] = shades
  }

  palette.forEach(([name]) => {
    generateColor(name, false)
    generateColor(name, true)
  })

  generateColor('black', true)
  generateColor('white', true)

  return colors
}

export function generateHues(prefix: string) {
  function createHue(postfix = ''): Record<number, string> {
    const hue: Record<string, string> = {}

    for (let shade = 1; shade <= 12; shade++) {
      hue[shade] = `var(${prefix}hue${postfix}${shade})`
      hue[`${shade}A`] = `var(${prefix}hue${postfix}${shade}A)`
    }

    if (postfix === '')
      hue.fg = `var(${prefix}hue-fg)`

    return hue
  }

  return { hue: createHue(), hueA: createHue('A') }
}

export function newPalette(...names: RadixColors[]): Palette {
  return names.map(n => [n, getColor(n)])
}

export function genCSS(
  palette: Palette,
  darkSelector: string,
  lightSelector: string,
  prefix: string,
): string {
  const css: string[] = []

  function pushVar(
    label: string,
    [shade, value]: [string, string],
    isAlpha = false,
  ) {
    css.push(`${prefix}${label}${shade}${isAlpha ? 'A' : ''}:${value};`)
  }

  css.push(`${lightSelector} {`)
  for (const [label, color] of palette) {
    Object.entries(color.light).forEach(entry => pushVar(label, entry))
    Object.entries(color.lightAlpha).forEach(entry =>
      pushVar(label, entry, true),
    )
  }
  css.push('}\n')

  css.push(`${darkSelector} {`)
  for (const [label, color] of palette) {
    Object.entries(color.dark).forEach(entry => pushVar(label, entry))
    Object.entries(color.darkAlpha).forEach(entry =>
      pushVar(label, entry, true),
    )
  }
  css.push('}')

  css.push(':root {')
  for (const [label] of palette)
    css.push(`${prefix}${label}-fg:${fg(label)};`)

  Object.entries(getScale('blackA')).forEach(entry =>
    pushVar('black', entry, true),
  )
  Object.entries(getScale('whiteA')).forEach(entry =>
    pushVar('white', entry, true),
  )
  css.push('}')

  return css.join('')
}

export function generateAliases(
  colors: ReturnType<typeof generateColors>,
  aliases: ColorAliases,
) {
  return Object.entries(aliases).reduce((o, [alias, target]) => {
    o[alias] = colors[target]
    o[`${alias}A`] = colors[`${target}A`]
    return o
  }, {} as Record<string, Record<number, string>>)
}
