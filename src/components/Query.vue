<script setup lang="ts">
import prettier from 'prettier/standalone'
import gqlParser from 'prettier/parser-graphql'
import type { Entry } from '~/types'
import { TYPE_COLORS } from '~/constants'

const props = defineProps<{
  entry: Entry
}>()

const activeView = ref('query')
const showPrettified = ref(true)
const options = ref({ mode: 'graphql' })
const codeRef = ref<any>(null)

const parsedQuery = computed(() => {
  const { type, request } = props.entry

  if (type === 'GQL') {
    return showPrettified.value
      ? prettier.format(request.query, { semi: false, parser: 'graphql', plugins: [gqlParser] })
      : request.query.replace(/\n$/, '')
  }

  return Object.entries(request.query).map(([name, value]) => ({
    name,
    value,
  }))
})

const viewButtons = computed(() => [
  {
    title: props.entry.type,
    name: 'query',
  },
  {
    title: 'HEADERS',
    name: 'headers',
  },
])

defineExpose({
  refresh() {
    codeRef.value?.refresh()
  },
})
</script>

<template>
  <div class="query-block h-full flex flex-col of-hidden bg-gray1">
    <TopBar
      v-model="activeView"
      :items="viewButtons"
      :color="TYPE_COLORS[entry.type]"
      :copy-value="activeView === 'query' ? (entry.type === 'GQL' ? parsedQuery : entry.request.url) : JSON.stringify(entry.request.headers, null, 2)"
      :show-search="activeView === 'query' && entry.type === 'GQL'"
      @toggle-search="codeRef?.toggleSearch()"
    >
      <template #left>
        <div
          v-if="entry"
          class="hide-scrollbar text-gray10 ml-2 of-auto whitespace-nowrap"
        >
          {{ entry.request.url }}
        </div>
      </template>
    </TopBar>
    <div v-if="entry" class="flex-grow of-hidden">
      <template v-if="activeView === 'query'">
        <Code
          v-if="isGQLEntry(entry)"
          ref="codeRef"
          :value="parsedQuery"
          :options="options"
          class="flex-grow pl-1"
        />
        <div v-else class="h-full">
          <div class="p-3">
            <ul class="space-y-3">
              <li class="flex flex-col font-semibold">
                <div class="text-gray8">
                  Origin
                </div>
                <div
                  class="text-gray12 bg-gray2A mt-1 rounded px-2 py-1.5"
                >
                  {{ entry.request.host }}
                </div>
              </li>
              <li class="flex flex-col font-semibold">
                <div class="text-gray8">
                  Path
                </div>
                <div
                  class="text-green12 bg-gray2A mt-1 rounded px-2 py-1.5"
                >
                  {{ entry.request.pathname }}
                </div>
              </li>
              <li v-if="parsedQuery.length" class="flex flex-col font-semibold">
                <div class="text-gray8">
                  Query Parameters
                </div>
                <Params :items="parsedQuery" class="mt-1" />
              </li>
            </ul>
          </div>
        </div>
        <ToggleButton
          v-if="isGQLEntry(entry)"
          v-model="showPrettified"
          v-tooltip.top="'Prettify'"
          class="absolute bottom-2 right-3 z-10 p-1"
        />
      </template>
      <Headers v-else-if="activeView === 'headers'" :items="entry.request.headers" class="h-full w-full of-hidden" />
    </div>
  </div>
</template>
