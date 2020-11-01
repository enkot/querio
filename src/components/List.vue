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
    <ul class="block flex-grow pt-2 overflow-scroll" v-else>
      <li
        v-for="entry in filteredEntries"
        :key="entry.id"
        class="flex items-center px-3 py-2 cursor-pointer hover:text-gray-800 dark-hover:text-white"
        :class="
          value && value.id === entry.id
            ? 'text-gray-800 bg-gray-250 dark:text-white dark:bg-gray-800'
            : 'text-gray-600 dark:text-gray-500 hover:bg-gray-200 dark-hover:bg-gray-825'
        "
        @click="$emit('input', entry)"
      >
        <span class="mr-1 font-bold">{{ entry.request.name }}:</span>
        <span
          v-for="(operation, i) in entry.request.operations"
          :key="operation"
          :class="{ 'text-red-500 dark:text-red-400': hasError(entry) }"
        >
          {{
            operation + (i === entry.request.operations.length - 1 ? '' : ',')
          }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import fuzzysearch from 'fuzzysearch'

export default {
  data() {
    return {
      keyword: '',
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
    filteredEntries() {
      return this.entries.filter(({ request }) =>
        request.operations.some(name =>
          fuzzysearch(this.keyword.toLowerCase(), name.toLowerCase())
        )
      )
    },
  },
  methods: {
    hasError({ response }) {
      return response.error || response.body.errors
    },
  },
}
</script>
