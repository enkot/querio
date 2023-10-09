<script setup lang="ts">
import { useFuse } from '@vueuse/integrations/useFuse'
import { TYPE_COLORS } from '~/constants'
import type { Entry } from '~/types'

const { entries = [] } = defineProps<{
  entries: Entry[]
}>()

const active = defineModel<number | string>({ local: true })

const ACTIVE_METHODS = {
  GQL: ['GQL'],
  RAW: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
}

const keyword = ref('')
const activeView = ref<keyof typeof ACTIVE_METHODS | 'ALL'>('ALL')
const viewButtons = ref([
  {
    title: 'ALL',
    name: 'ALL',
    label: 'All requests',
  },
  {
    title: 'GQL',
    name: 'GQL',
    label: 'GraphQL',
  },
  {
    title: 'RAW',
    name: 'RAW',
    label: 'Fetch and XHR',
  },
])

const filtered = useArrayFilter(() => entries, ({ type }) =>
  activeView.value === 'ALL'
            || ACTIVE_METHODS[activeView.value].includes(type))
const sorted = useSorted(filtered, (a, b) => settings.sortOption === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp)

function getColor(entry: Entry) {
  return TYPE_COLORS[isGQLEntry(entry) ? entry.request.operationType.toUpperCase() : entry.type]
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="h-12 flex flex-shrink-0 items-center px-3">
      <input
        v-model="keyword"
        type="text"
        class="placeholder-gray10 text-gray12 w-full border border-gray4 rounded-sm bg-gray1 px-3 py-1.5 text-xs"
        placeholder="Filter"
      >
    </div>
    <Scroll class="flex-grow border-b border-gray4">
      <ul class="q-scrollbar block flex-grow of-y-auto">
        <Tooltip
          v-for="entry in sorted"
          :key="entry.id"
        >
          <template #trigger>
            <li
              class="group relative flex cursor-pointer items-center truncate px-3 py-2"
              :class="[
                active === entry.id
                  ? 'bg-gray2A text-gray12'
                  : 'text-gray11 hover:(bg-gray2A text-gray12)',
                {
                  'text-red10 hover:text-red12':
                    entry.response.isError,
                },
              ]"
              @click="active = entry.id"
            >
              <div
                class="h-5 w-5 flex flex-shrink-0 items-center justify-center rounded-sm font-bold uppercase"
                :class="active === entry.id ? `bg-${getColor(entry)}4A text-${getColor(entry)}11 dark:bg-${getColor(entry)}3A` : `bg-gray3A group-hover:bg-${getColor(entry)}3A group-hover:text-${getColor(entry)}11 text-gray11`"
              >
                {{ isGQLEntry(entry) ? entry.request.operationType.at(0) : entry.type.at(0) }}
              </div>
              <span class="ml-2 font-semibold">
                {{ isGQLEntry(entry) && !entry.request.name ? entry.request.operations.join(', ') : entry.request.name }}
              </span>
              <span v-if="!isGQLEntry(entry)" class="font-semibold opacity-50">{{ entry.request.queryString }}</span>
            </li>
          </template>
          <span>{{ entry.request.url }}</span>
        </Tooltip>
      </ul>
    </Scroll>
    <div
      class="h-10 flex flex-shrink-0 items-center justify-between px-3"
    >
      <ButtonGroup
        v-model="activeView"
        :items="viewButtons"
        class="flex-shrink-0"
      />
    </div>
  </div>
</template>
