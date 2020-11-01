<template>
  <div class="query-block flex flex-col">
    <div class="flex flex-shrink-0 h-10 items-center px-3 overflow-hidden">
      <ButtonGroup
        v-model="activeView"
        :items="viewButtons"
        activeBgClass="bg-pink-500"
        class="flex-shrink-0"
      />
      <div
        v-if="entry"
        class="whitespace-no-wrap overflow-auto hide-scrollbar ml-2 text-gray-550 dark:text-gray-600"
      >
        {{ entry.request.url }}
      </div>
    </div>
    <div v-if="entry" class="relative flex-grow overflow-hidden">
      <codemirror
        v-if="activeView === 'GQL'"
        ref="cmEditor"
        :value="query"
        :options="cmOptions"
        class="h-full ml-1"
      />
      <Scroll v-else-if="activeView === 'Headers'" :ops="scrollOptions">
        <Headers :items="entry.request.headers" />
      </Scroll>
    </div>
  </div>
</template>

<script>
import Headers from '@/components/Headers'

import tailwind from '../../tailwind.config'

export default {
  components: {
    Headers,
  },
  props: {
    entry: {
      type: Object,
    },
  },
  computed: {
    query() {
      return this.entry.request.query.replace(/\n$/, '')
    },
    scrollOptions() {
      return {
        bar: {
          background: tailwind.theme.extend.colors.gray['500'],
        },
      }
    },
  },
  data() {
    return {
      activeView: 'GQL',
      viewButtons: [
        {
          name: 'GQL',
        },
        {
          name: 'Headers',
        },
      ],
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