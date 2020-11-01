<template>
  <div class="response-block w-full flex flex-col">
    <div class="flex flex-shrink-0 h-10 items-center px-3">
      <ButtonGroup
        v-model="activeView"
        :items="viewButtons"
        :activeBgClass="hasError ? 'bg-red-500' : 'bg-green-400'"
        class="flex-shrink-0"
      />
      <div class="text-xs text-gray-550 dark:text-gray-600 ml-3">
        {{ entry.time.toFixed(2) }} ms
      </div>
    </div>
    <div
      v-if="entry.response.error"
      class="flex flex-grow justify-center items-center"
    >
      <div class="text-center">
        <Error class="h-40" />
        <span
          v-if="entry.response.status"
          class="inline-block text-xl mt-4 text-gray-900 dark:text-gray-100"
        >
          {{ entry.response.status }}
        </span>
        <span class="inline-block mt-4 text-gray-800 dark:text-gray-500">
          {{ entry.response.error }}
        </span>
      </div>
    </div>
    <div v-else class="relative flex-grow pl-1 overflow-hidden">
      <codemirror v-if="errors" v-model="errors" class="h-full" />
      <codemirror v-else v-model="data" class="h-full" />
    </div>
  </div>
</template>

<script>
import Error from '@/assets/error.svg'

export default {
  components: {
    Error,
  },
  props: {
    entry: {
      type: Object,
    },
  },
  data() {
    return {
      data: '',
      errors: '',
      activeView: 'Data',
    }
  },
  computed: {
    viewButtons() {
      return [
        {
          name: 'Data',
        },
        {
          name: 'Headers',
        },
      ]
    },
    hasError() {
      return this.entry.response.error || this.entry.response.body.errors
    },
  },
  watch: {
    entry: {
      async handler() {
        if (!this.entry) return
        const { data, errors } = this.entry.response.body
        this.data = JSON.stringify(data, null, 2)
        this.errors = JSON.stringify(errors, null, 2)
      },
      immediate: true,
    },
  },
}
</script>
