<template>
  <div class="response-block w-full flex flex-col">
    <div class="flex justify-between flex-shrink-0 h-10 items-center px-3">
      <div class="flex flex-shrink-0 items-center">
        <ButtonGroup
          v-model="activeView"
          :items="viewButtons"
          :activeBgClass="
            entry.response.isError ? 'bg-red-500' : 'bg-green-400'
          "
          class="flex-shrink-0"
        />
        <div
          v-if="entry.response.status"
          class="text-xs text-gray-550 dark:text-gray-500 ml-3"
        >
          {{ entry.response.status }} {{ entry.response.statusMessage }}
        </div>
        <div class="text-xs text-gray-550 dark:text-gray-500 ml-3">
          {{ entry.time.toFixed(2) }} ms
        </div>
      </div>
      <div
        v-if="entry.type !== 'GQL'"
        class="whitespace-nowrap overflow-auto hide-scrollbar ml-2 text-gray-500 dark:text-gray-600"
      >
        {{ entry.response.mimeType }}
      </div>
    </div>
    <div class="relative flex-grow overflow-hidden">
      <template v-if="activeView === 'data'">
        <div
          v-if="entry.response.networkError"
          class="flex flex-grow justify-center items-center h-full"
        >
          <div class="flex flex-col items-center">
            <ErrorImg class="h-40" />
            <span class="inline-block mt-4 text-gray-800 dark:text-gray-500">
              {{ entry.response.networkError }}
            </span>
          </div>
        </div>
        <div
          v-else-if="parseError"
          class="flex flex-grow justify-center items-center h-full"
        >
          <div class="flex flex-col items-center">
            <CodeImg class="h-40" />
            <span class="inline-block mt-4 text-gray-800 dark:text-gray-500">
              {{ entry.response.mimeType }}
            </span>
            <span class="inline-block text-gray-500 dark:text-gray-700">
              {{ parseError }}
            </span>
          </div>
        </div>
        <template v-else>
          <codemirror v-if="errors" v-model="errors" class="h-full ml-1" />
          <codemirror v-else v-model="data" class="h-full ml-1" />
        </template>
      </template>
      <Headers
        v-else-if="activeView === 'headers'"
        :items="entry.response.headers"
      />
    </div>
  </div>
</template>

<script>
import Headers from '@/components/Headers'
import ErrorImg from '@/assets/error.svg'
import CodeImg from '@/assets/code.svg'

export default {
  components: {
    Headers,
    ErrorImg,
    CodeImg,
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
      activeView: 'data',
      parseError: null,
    }
  },
  computed: {
    viewButtons() {
      return [
        {
          title: 'DATA',
          name: 'data',
        },
        {
          title: 'HEADERS',
          name: 'headers',
        },
      ]
    },
  },
  watch: {
    entry: {
      async handler() {
        if (!this.entry) return

        this.parseError = null

        try {
          const { data, errors } = await this.entry.response.getResponse()

          this.data = JSON.stringify(data, null, 2)
          this.errors = JSON.stringify(errors, null, 2)
        } catch (e) {
          this.parseError = e.message
        }
      },
      immediate: true,
    },
  },
}
</script>
