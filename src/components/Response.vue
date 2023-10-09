<script lang="ts" setup>
import type { Entry } from '~/types'

const props = defineProps<{
  entry: Entry
}>()

const activeView = ref('data')
const data = ref<string | null>(null)
const error = ref<string | null>(null)
const codeRef = ref<any>(null)

const viewButtons = computed(() => [
  {
    title: 'DATA',
    name: 'data',
  },
  {
    title: 'HEADERS',
    name: 'headers',
  },
])

watch(() => props.entry, async (entry) => {
  data.value = null
  error.value = null

  if (!entry)
    return

  try {
    const response = await entry.response.getResponse()

    if (!response)
      return

    data.value = JSON.stringify(isGQLEntry(entry) ? response.errors || response.data : response, null, 2)
  }
  catch (e: any) {
    error.value = e.message
  }
}, { immediate: true })

defineExpose({
  refresh() {
    codeRef.value?.refresh()
  },
})
</script>

<template>
  <div class="response-block group h-full flex flex-col of-hidden bg-gray1">
    <TopBar
      v-model="activeView"
      :items="viewButtons"
      :color="entry.response.isError ? 'red' : 'green'"
      :copy-value="activeView === 'data' ? data : JSON.stringify(entry.response.headers, null, 2)"
      :show-search="activeView === 'data'"
      @toggle-search="codeRef.toggleSearch()"
    >
      <template #left>
        <div class="flex flex-shrink-0 of-auto">
          <div
            v-if="entry.response.status"
            class="text-gray10 ml-3 text-xs"
          >
            {{ entry.response.status }} {{ entry.response.statusMessage }}
          </div>
          <div class="text-gray10 ml-3 text-xs">
            {{ entry.time.toFixed(2) }} ms
          </div>
        </div>
      </template>
      <template #right>
        <div
          v-if="entry.type !== 'GQL'"
          class="hide-scrollbar text-gray10 ml-2 of-auto whitespace-nowrap"
        >
          {{ entry.response.mimeType }}
        </div>
      </template>
    </TopBar>
    <div class="relative flex-grow of-hidden">
      <template v-if="activeView === 'data'">
        <div
          v-if="entry.response.error"
          class="h-full flex flex-grow items-center justify-center"
        >
          <div class="flex flex-col items-center">
            <ErrorImg class="h-40" />
            <span
              class="mt-4 inline-block text-gray-800 dark:text-gray-500"
            >{{ entry.response.error }}</span>
          </div>
        </div>
        <div v-else-if="error" class="h-full flex flex-grow items-center justify-center">
          <div class="flex flex-col items-center">
            <CodeImg class="h-40" />
            <span
              class="mt-4 inline-block text-gray-800 dark:text-gray-500"
            >{{ entry.response.mimeType }}</span>
            <span class="inline-block text-gray-500 dark:text-gray-700">{{ error }}</span>
          </div>
        </div>
        <template v-else>
          <Code ref="codeRef" :code="data || ''" class="h-full pl-1" />
        </template>
      </template>
      <Headers v-else-if="activeView === 'headers'" :items="entry.response.headers" class="h-full w-full of-hidden" />
    </div>
  </div>
</template>
