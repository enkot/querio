import type { Log as _Log } from 'har-format'
import { createApp } from 'vue'

import type { BaseEntry, Entry, HAREntry } from './types'
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
  const preflightIndex = (entries as Entry[]).findIndex(e => e?.request?.url === entry.request.url && e?.request.method === 'OPTIONS')

  function replacePreflightEntry<E extends BaseEntry>(parsed: E) {
    const preflight = entries[preflightIndex] as E

    return {
      ...parsed,
      request: {
        ...parsed.request,
        preflightHeaders: preflight.request.headers,
      },
      response: {
        ...parsed.response,
        preflightHeaders: preflight.response.headers,
      },
    }
  }

  if (isGraphQL(entry)) {
    const parsedEntries = parseGQLEntry(entry)

    if (preflightIndex >= 0) {
      entries[preflightIndex] = [parsedEntries].flat().map(e => replacePreflightEntry(e))
      return
    }

    entries.push(parsedEntries)
  }
  else if (isHTTP(entry)) {
    const parsed = parseHTTPEntry(entry)

    if (preflightIndex >= 0) {
      entries[preflightIndex] = replacePreflightEntry(parsed)
      return
    }

    entries.push(parsed)
  }
})

const app = createApp(App)

app.mount('#app')
