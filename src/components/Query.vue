<script setup lang="ts">
import prettier from 'prettier/standalone'
import gqlParser from 'prettier/parser-graphql'
import type { Row } from './base/Table.vue'
import type { Entry } from '~/types'
import { TYPE_COLORS } from '~/constants'

const props = defineProps<{
  entry: Entry
}>()

const activeView = ref('query')
const mode = ref('graphql')
const codeRef = ref<any>(null)

const parsedQuery = computed(() => {
  const { type, request } = props.entry

  if (type === 'GQL')
    return prettier.format(request.query, { semi: false, parser: 'graphql', plugins: [gqlParser] })

  return Object.entries(request.query).map(([name, value]) => ({
    name,
    value,
  })) as Row[]
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
    // codeRef.value?.refresh()
  },
})
</script>

<template>
  <div class="query-block h-full flex flex-col of-hidden bg-gray1">
    <TopBar
      v-model="activeView"
      :items="viewButtons"
      :color="TYPE_COLORS[entry.type]"
      :copy-value="activeView === 'query' ? (entry.type === 'GQL' ? parsedQuery as string : entry.request.url) : JSON.stringify(entry.request.headers, null, 2)"
      :show-search="activeView === 'query' && entry.type === 'GQL'"
      @toggle-search="codeRef?.toggleSearch()"
    >
      <template #left>
        <div
          v-if="entry"
          class="hide-scrollbar ml-2 of-auto whitespace-nowrap text-gray10"
        >
          {{ entry.request.url }}
        </div>
      </template>
      <template #right>
        <div v-if="isGQLEntry(entry) && entry.request.batch" class="rounded-sm px-1.5 py-1 text-tiny font-bold uppercase text-amber8">
          <span class="text-amber8">{{ entry.request.batch.count }}/{{ entry.request.batch.length }}</span> in Batch
        </div>
      </template>
    </TopBar>
    <div v-if="entry" class="relative flex flex-1 flex-col of-hidden">
      <template v-if="activeView === 'query'">
        <Code
          v-if="isGQLEntry(entry)"
          ref="codeRef"
          :code="parsedQuery as string"
          :mode="mode"
          class="of-auto"
        />
        <div v-else class="flex flex-1 flex-col of-auto">
          <div class="px-2 py-3">
            <ul class="space-y-2">
              <li v-if="entry.request.host" class="flex flex-col font-semibold">
                <div class="text-gray9">
                  Origin
                </div>
                <div class="group relative flex items-center rounded bg-gray2A text-gray12">
                  <div class="flex-grow px-2 py-1.5">
                    {{ entry.request.host }}
                  </div>
                  <CopyButton :value="entry.request.host" class="sticky top-0 h-full flex-shrink-0 -right-2 op-0! group-hover:op-100!" />
                </div>
              </li>
              <li class="flex flex-col font-semibold">
                <div class="text-gray9">
                  Path
                </div>
                <div class="group relative flex items-center rounded bg-gray2A text-green10">
                  <div class="flex-grow px-2 py-1.5">
                    {{ entry.request.pathname }}
                  </div>
                  <CopyButton :value="entry.request.pathname" class="sticky top-0 h-full flex-shrink-0 -right-2 op-0! group-hover:op-100!" />
                </div>
              </li>
              <li v-if="parsedQuery.length && (typeof parsedQuery !== 'string')" class="flex flex-col">
                <div class="font-semibold text-gray9">
                  Query Parameters
                </div>
                <Table :items="parsedQuery" class="mt-1" />
              </li>
            </ul>
          </div>
        </div>
      </template>
      <Table
        v-else-if="activeView === 'headers'"
        :items="entry.request.headers"
        class="px-2 py-1"
      />
    </div>
  </div>
</template>
