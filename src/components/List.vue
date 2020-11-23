<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center flex-shrink-0 h-10 px-3">
      <input
        v-model="keyword"
        class="form-input form-input-sm dark:text-white dark:bg-cool-gray-900 dark:border-gray-800 w-full placeholder-gray-600"
        placeholder="Find..."
      />
    </div>
    <div
      v-if="!entries.length"
      class="flex justify-center items-center p-4 h-full text-center text-gray-600"
    >
      Waiting for requests...
    </div>
    <div
      v-else-if="!filteredEntries.length"
      class="flex justify-center items-center p-4 h-full text-center text-gray-600"
    >
      No results found for "{{ keyword }}"
    </div>
    <Scroll v-else>
      <ul class="block flex-grow pt-2">
        <li
          v-for="entry in filteredEntries"
          :key="entry.id"
          class="flex items-center px-3 py-2 cursor-pointer hover:text-gray-800 dark-hover:text-white truncate"
          :class="[
            value && value.id === entry.id
              ? 'text-gray-800 bg-gray-250 dark:text-white dark:bg-gray-800'
              : 'text-gray-600 dark:text-gray-500 hover:bg-gray-200 dark-hover:bg-gray-825',
            {
              'text-red-500 dark:text-red-400 hover:text-red-500 dark-hover:text-red-400':
                entry.response.isError,
            },
          ]"
          @click="$emit('input', entry)"
        >
          <span class="font-medium">{{ entry.request.name }}</span>
          <span class="font-medium opacity-50">
            {{ entry.request.queryString }}
          </span>
          <template v-if="entry.type === 'GQL'">
            <span class="mr-1">:</span>
            <span
              v-for="(operation, i) in entry.request.operations"
              :key="operation"
            >
              {{
                operation +
                  (i === entry.request.operations.length - 1 ? '' : ',')
              }}
            </span>
          </template>
        </li>
      </ul>
    </Scroll>
    <div
      class="flex justify-between items-center flex-shrink-0 h-10 px-3 border-t border-gray-300 dark:border-gray-800"
    >
      <ButtonGroup
        v-model="activeView"
        :items="viewButtons"
        activeBgClass="bg-gray-600 dark:bg-gray-700"
        class="flex-shrink-0"
      />
      <button
        v-if="filteredEntries.length"
        class="flex h-10 w-10 justify-center items-center -mr-3 text-gray-600 hover:text-gray-800 dark-hover:text-gray-400 focus:outline-none"
        @click="$emit('clear')"
      >
        <BanIcon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import fuzzysearch from 'fuzzysearch'

import BanIcon from '@/assets/ban-icon.svg'

export default {
  components: {
    BanIcon,
  },
  data() {
    return {
      keyword: '',
      activeView: 'ALL',
      viewButtons: [
        {
          title: 'All',
          name: 'ALL',
        },
        {
          title: 'GQL',
          name: 'GQL',
        },
        {
          title: 'Raw',
          name: 'RAW',
        },
      ],
    }
  },
  props: {
    value: {
      type: Object,
    },
    entries: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(['typeColors']),
    filteredEntries() {
      console.log('this.entries', JSON.stringify(this.entries))
      return this.entries
        .filter(({ type, request }) => {
          console.log('type', type)
          if (type === 'GQL')
            return request.operations.some(name =>
              fuzzysearch(
                this.keyword.toLowerCase(),
                `${request.name}: ${name}`.toLowerCase()
              )
            )
          else
            return fuzzysearch(
              this.keyword.toLowerCase(),
              request.name.toLowerCase()
            )
        })
        .filter(({ type }) => {
          if (this.activeView === 'GQL' && type !== 'GQL') return
          if (this.activeView === 'RAW' && type === 'GQL') return
          return true
        })
    },
  },
}
</script>
