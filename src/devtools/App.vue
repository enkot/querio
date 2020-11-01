<template>
  <div class="flex flex-col md:flex-row h-screen bg-white dark:bg-gray-900">
    <div
      class="flex md:flex-col justify-between h-10 md:h-auto md:w-10 bg-gray-100 dark:bg-gray-850 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-800"
    >
      <div class="flex h-10 w-10 justify-center items-center">
        <Logo class="h-5 w-5" />
      </div>
      <button
        class="flex h-10 w-10 justify-center items-center text-gray-600 hover:bg-gray-300 dark-hover:bg-gray-800 focus:outline-none"
        @click="settingsOpened = true"
      >
        <CogIcon class="h-5 w-5 " />
      </button>
    </div>
    <div class="flex-grow grid grid-cols-12 grid-rows-6 w-full overflow-hidden">
      <div
        class="col-span-4 md:col-span-2 row-span-6 bg-gray-100 dark:bg-gray-850 border-r border-gray-300 dark:border-gray-800 overflow-hidden"
      >
        <List v-model="active" :entries="entries" />
      </div>
      <div
        v-if="!active"
        class="flex justify-center items-center row-span-6 md:row-span-6 col-span-8 md:col-span-10"
      >
        <Ghost class="h-40" />
      </div>
      <template v-else>
        <div
          class="grid grid-rows-1 row-span-3 md:row-span-6 col-span-8 md:col-span-4 bg-white dark:bg-gray-900 overflow-hidden"
        >
          <div class="flex flex-col overflow-hidden">
            <Query
              ref="query"
              :entry="active"
              class="flex-grow border-b border-gray-300 dark:border-gray-800 overflow-hidden"
            />
            <Variables
              :entry="active"
              class="flex-shrink-0 border-b md:border-none border-gray-300 dark:border-gray-800 overflow-hidden"
              @toggled="refresh"
            />
          </div>
        </div>
        <div
          class="grid grid-rows-1 row-span-3 md:row-span-6 col-span-8 md:col-span-6 bg-white dark:bg-gray-900 overflow-hidden"
        >
          <Response
            :entry="active"
            class="md:border-l border-gray-300 dark:border-gray-800 overflow-hidden"
          />
        </div>
      </template>
    </div>
    <Settings
      v-model="settingsOpened"
      :settings="settings"
      @update:settings="settingsChanged"
    />
    <portal-target name="modals" />
  </div>
</template>

<script>
import Lockr from 'lockr'
import { isGraphQL, parseEntry } from '@/utils'

import List from '@/components/List'
import Query from '@/components/Query'
import Variables from '@/components/Variables'
import Response from '@/components/Response'
import Settings from '@/components/Settings'

import Logo from '@/assets/logo-small.svg'
import Ghost from '@/assets/ghost.svg'
import CogIcon from '@/assets/cog.svg'

Lockr.prefix = 'graphio_'

export default {
  name: 'App',
  components: {
    List,
    Query,
    Variables,
    Response,
    Settings,
    Logo,
    Ghost,
    CogIcon,
  },
  data() {
    return {
      entries: [],
      active: null,
      settings: Lockr.get('settings') || {
        colorMode: 'Auto',
      },
      settingsOpened: false,
    }
  },
  created() {
    this.changeColorMode(this.settings.colorMode)
    browser.devtools.network.onRequestFinished.addListener(async entry => {
      console.log('called')
      if (!isGraphQL(entry)) return

      const entries = await parseEntry(entry)

      console.log('entries', entries)

      console.log('entry', entry)

      entries.forEach(data => {
        this.entries.push(data)
        if (!this.active) [this.active] = this.entries
      })
    })
  },
  methods: {
    async refresh() {
      await this.$nextTick()
      if (this.$refs.query) this.$refs.query.refresh()
    },
    settingsChanged(settings) {
      Lockr.set('settings', settings)

      this.changeColorMode(settings.colorMode)
    },
    changeColorMode(colorMode) {
      if (colorMode === 'Auto' && browser.devtools.panels.themeName === 'dark')
        colorMode = 'Dark'

      if (colorMode === 'Dark') {
        document.documentElement.classList.add('mode-dark')
      } else {
        document.documentElement.classList.remove('mode-dark')
      }
    },
  },
}
</script>
