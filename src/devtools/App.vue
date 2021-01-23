<template>
  <div class="flex flex-col md:flex-row h-screen bg-white dark:bg-gray-900">
    <div
      class="flex md:flex-col justify-between h-10 md:h-auto md:w-10 bg-gray-50 dark:bg-gray-850 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-750"
    >
      <div class="flex h-10 w-10 justify-center items-center">
        <Logo class="h-5 w-5" />
      </div>
      <button
        class="flex h-10 w-10 justify-center items-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-400 focus:outline-none"
        @click="settingsOpened = true"
      >
        <CogIcon class="h-5 w-5 focus:outline-none" v-tooltip="'Settings'" />
      </button>
    </div>
    <splitpanes
      class="flex flex-row flex-grow w-full overflow-hidden"
      :push-other-panes="false"
    >
      <pane
        min-size="18"
        :size="$mq | mq({ md: 35, lg: 18 })"
        class="bg-gray-50 dark:bg-gray-850 border-r border-gray-200 dark:border-gray-750 overflow-hidden"
      >
        <List v-model="activeId" :entries="entries" @clear="clear" />
      </pane>
      <pane :size="$mq | mq({ md: 65, lg: 82 })" min-size="50">
        <div
          v-if="!active"
          class="flex justify-center items-center row-span-6 md:row-span-6 col-span-8 md:col-span-10 h-full"
        >
          <Ghost class="h-40" />
        </div>
        <splitpanes
          v-else
          :horizontal="$mq | mq({ md: true, lg: false })"
          class="flex flex-col md:flex-row"
          :push-other-panes="false"
        >
          <pane
            min-size="30"
            size="50"
            class="bg-white dark:bg-gray-900 overflow-hidden"
          >
            <splitpanes
              horizontal
              class="flex flex-col overflow-hidden border-b md:border-none border-gray-200 dark:border-gray-750"
              :push-other-panes="false"
              @resized="resized"
            >
              <pane :size="100 - variablesSize" style="min-height: 2.5rem">
                <Query
                  ref="query"
                  :entry="active"
                  class="flex-grow overflow-hidden h-full"
                />
              </pane>
              <pane
                v-if="showVariables"
                :size="variablesSize"
                style="min-height: 2.5rem"
              >
                <Variables
                  :entry="active"
                  class="overflow-hidden h-full"
                  @toggled="toggleVariables"
                />
              </pane>
            </splitpanes>
          </pane>
          <pane class="bg-white dark:bg-gray-900 overflow-hidden" min-size="30">
            <Response
              :entry="active"
              class="md:border-l border-gray-200 dark:border-gray-750 overflow-hidden h-full"
            />
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>
    <Settings
      v-model="settingsOpened"
      :settings="settings"
      @update:settings="changeSettings"
    />
    <portal-target name="modals" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import { isGraphQL, isHTTP, parseGQLEntry, parseHTTPEntry } from '@/utils'

import List from '@/components/List'
import Query from '@/components/Query'
import Variables from '@/components/Variables'
import Response from '@/components/Response'
import Settings from '@/components/Settings'

import Logo from '@/assets/logo-small.svg'
import Ghost from '@/assets/ghost.svg'
import CogIcon from '@/assets/cog.svg'

export default {
  name: 'App',
  components: {
    Splitpanes,
    Pane,
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
      activeId: null,
      settingsOpened: false,
      variablesSize: 0,
    }
  },
  computed: {
    ...mapState(['lastState', 'settings']),
    active() {
      return this.entries.find((item) => item && item.id === this.activeId)
    },
    showVariables() {
      return this.active.type !== 'GET'
    },
  },
  created() {
    this.changeSettings(this.settings)
    this.variablesSize = this.lastState.variablesOpened ? 50 : 0
    browser.devtools.network.getHAR((harLog) =>
      harLog.entries.forEach(this.addEntry)
    )
    browser.devtools.network.onRequestFinished.addListener(this.addEntry)
  },
  methods: {
    ...mapMutations(['setLastState', 'setSettings']),
    async addEntry(req) {
      if (isGraphQL(req)) {
        const entries = await parseGQLEntry(req)
        entries.forEach((entry) => this.pushEntry(entry))
      } else if (isHTTP(req)) {
        const entry = await parseHTTPEntry(req)
        this.pushEntry(entry)
      }
      if (!this.activeId && this.entries.length)
        this.activeId = this.entries[0].id
    },
    pushEntry(entry) {
      if (
        !entry ||
        (entry &&
          this.lastState.clearedAt &&
          this.lastState.clearedAt > entry.timestamp)
      )
        return

      this.entries.push(entry)
    },
    resized([, item]) {
      if (item) this.variablesSize = item.size
    },
    async toggleVariables(show) {
      this.variablesSize = show ? 50 : 0
      this.setLastState({
        variablesOpened: show,
      })
      await this.$nextTick()
      if (this.$refs.query) this.$refs.query.refresh()
    },
    changeSettings(settings) {
      this.setSettings(settings)
      this.changeColorMode()
    },
    changeColorMode() {
      if (this.settings.colorTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    clear() {
      this.entries = []
      this.activeId = null
      this.setLastState({
        clearedAt: Date.now(),
      })
    },
  },
}
</script>
