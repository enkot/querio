import type { Entry } from '~/types'

export const entries = reactive<(Entry | Entry[])[]>([])

export const colorMode = useColorMode({
  emitAuto: true,
  modes: {
    auto: '',
    light: 'light-theme',
    dark: 'dark-theme',
  },
})

export const lastState = toReactive(useStorageLocal('lastState', {
  clearedAt: false,
  activeView: 'ALL',
  variablesOpened: false,
}))

export const settings = toReactive(useStorageLocal('settings', {
  sortOption: 'newest',
  newestSelected: false,
}))
