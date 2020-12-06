<template>
  <div class="query-block flex flex-col">
    <div class="flex flex-shrink-0 h-10 items-center px-3 overflow-hidden">
      <ButtonGroup
        v-model="activeView"
        :items="viewButtons"
        :activeBgClass="`bg-${typeColors[entry.type]}`"
        class="flex-shrink-0"
      />
      <div
        v-if="entry"
        class="whitespace-nowrap overflow-auto hide-scrollbar ml-2 text-gray-550 dark:text-gray-500"
      >
        {{ entry.request.url }}
      </div>
    </div>
    <div v-if="entry" class="relative flex-grow overflow-hidden">
      <template v-if="activeView === 'query'">
        <codemirror
          v-if="entry.type === 'GQL'"
          ref="cmEditor"
          :value="query"
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
                >
                  {{ entry.request.origin }}
                </div>
              </li>
              <li class="flex flex-col font-semibold">
                <div class="text-gray-600">Path</div>
                <div
                  class="mt-1 px-2 py-1.5 rounded bg-gray-100 dark:bg-gray-850 text-attribute dark:text-attribute-light"
                >
                  {{ entry.request.pathname }}
                </div>
              </li>
              <li v-if="query.length" class="flex flex-col font-semibold">
                <div class="text-gray-600">Query Parameters</div>
                <Params :items="query" class="mt-1" />
              </li>
            </ul>
          </div>
        </Scroll>
      </template>
      <Headers
        v-else-if="activeView === 'headers'"
        :items="entry.request.headers"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Headers from '@/components/Headers'
import Params from '@/components/Params'

export default {
  components: {
    Headers,
    Params,
  },
  props: {
    entry: {
      type: Object,
    },
  },
  computed: {
    ...mapState(['typeColors']),
    query() {
      const { type, request } = this.entry

      return type === 'GQL'
        ? request.query.replace(/\n$/, '')
        : Object.entries(request.query).map(([name, value]) => ({
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
      cmOptions: {
        mode: 'graphql',
      },
    }
  },
  methods: {
    refresh() {
      this.$refs.cmEditor && this.$refs.cmEditor.codemirror.refresh()
    },
  },
}
</script>