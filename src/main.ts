import type { Log as _Log } from 'har-format'
import { createApp } from 'vue'

import type { HAREntry } from './types'
import App from './App.vue'
import { entries } from './composables/store'
import { isGraphQL, isHTTP, parseGQLEntry, parseHTTPEntry } from './utils'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const prefersDark = browser.devtools.panels.themeName === 'dark'
const setting = localStorage.getItem('vueuse-color-scheme') || 'auto'

export interface Log extends _Log {
  entries: HAREntry[]
}

if (setting === 'dark' || (prefersDark && setting !== 'light'))
  document.documentElement.classList.toggle('dark-theme', true)

// @ts-expect-error Incorrect types
browser.devtools.network.onRequestFinished.addListener((entry: HAREntry) => {
  if (isGraphQL(entry)) {
    const parsedEntries = parseGQLEntry(entry)

    entries.push(...parsedEntries)
  }
  else if (isHTTP(entry)) {
    const parsed = parseHTTPEntry(entry)

    entries.push(parsed)
  }
})

const app = createApp(App)

app.mount('#app')
