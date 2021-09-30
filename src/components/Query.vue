<template>
  <div class="query-block flex flex-col">
    <TopBar
      v-model="activeView"
      :items="viewButtons"
      :color="typeColors[entry.type]"
      :copyValue="activeView === 'query' ? (entry.type === 'GQL' ? parsedQuery : entry.request.url) : JSON.stringify(entry.request.headers, null, 2)"
      :showSearch="activeView === 'query' && entry.type === 'GQL'"
      @toggleSearch="$refs.code.toggleSearch()"
    >
      <template #left>
        <div
          v-if="entry"
          class="whitespace-nowrap overflow-auto hide-scrollbar ml-2 text-gray-550 dark:text-gray-500"
        >{{ entry.request.url }}</div>
      </template>
    </TopBar>
    <div v-if="entry" class="relative flex-grow overflow-hidden">
      <template v-if="activeView === 'query'">
        <Code
          v-if="entry.type === 'GQL'"
          ref="code"
          :data="parsedQuery"
          :options="cmOptions"
          class="h-full ml-1"
        />
        <Scroll v-else>
          <div class="p-3">
            <ul class="space-y-3">
              <li class="flex flex-col font-semibold">
                <div class="text-gray-600">Origin</div>
                <div
                  class="mt-1 px-2 py-1.5 rounded bg-gray-100 dark:bg-gray-850 text-gray-700 dark:text-gray-200"
                >{{ entry.request.origin }}</div>
              </li>
              <li class="flex flex-col font-semibold">
                <div class="text-gray-600">Path</div>
                <div
                  class="mt-1 px-2 py-1.5 rounded bg-gray-100 dark:bg-gray-850 text-attribute dark:text-attribute-light"
                >{{ entry.request.pathname }}</div>
              </li>
              <li v-if="parsedQuery.length" class="flex flex-col font-semibold">
                <div class="text-gray-600">Query Parameters</div>
                <Params :items="parsedQuery" class="mt-1" />
              </li>
            </ul>
          </div>
        </Scroll>
        <ToggleButton
          v-if="entry.type === 'GQL'"
          v-model="showPretified"
          class="absolute bottom-2 right-3 p-1 z-10"
          v-tooltip.top="'Prettify'"
        />
      </template>
      <Headers v-else-if="activeView === 'headers'" :items="entry.request.headers" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { print, parse } from 'graphql'
import Headers from '@/components/Headers'
import TopBar from '@/components/TopBar'
import Params from '@/components/Params'
import Code from '@/components/Code'

export default {
  components: {
    Headers,
    TopBar,
    Params,
    Code
  },
  props: {
    entry: {
      type: Object,
    },
  },
  computed: {
    ...mapState(['typeColors']),
    parsedQuery() {
      const { type, request } = this.entry

      if (type === 'GQL') {
        return this.showPretified ? print(parse(request.query)) : request.query.replace(/\n$/, '')
      }

      return Object.entries(request.query).map(([name, value]) => ({
        name,
        value,
      }))
    },
    viewButtons() {
      return [
        {
          title: this.entry.type,
          name: 'query',
        },
        {
          title: 'HEADERS',
          name: 'headers',
        },
      ]
    },
  },
  data() {
    return {
      activeView: 'query',
      showPretified: true,
      cmOptions: {
        mode: 'graphql',
      },
    }
  },
  methods: {
    refresh() {
      this.$refs.code.refresh()
    }
  },
}
</script>