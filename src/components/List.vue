<script setup lang="ts">
import { TYPE_COLORS } from '~/constants'
import type { Entry } from '~/types'

const { entries = [] } = defineProps<{
  entries: (Entry | Entry[])[]
}>()

const [DefineListItem, ReuseListItem] = createReusableTemplate<{ entry: Entry; color: string }>()
const active = defineModel<number | string>({ local: true })

const ACTIVE_METHODS = {
  GQL: ['GQL'],
  RAW: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
}

const keyword = ref('')
const activeView = ref<keyof typeof ACTIVE_METHODS | 'ALL'>('ALL')
const lastCleared = ref(Date.now())
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

const filtered = useArrayFilter(() => entries, (entry) => {
  const _entry = Array.isArray(entry) ? entry[0] : entry
  return (activeView.value === 'ALL' || ACTIVE_METHODS[activeView.value].includes(_entry.type))
    && _entry.request.method !== 'OPTIONS'
    && [entry].flat().some(({ request }) => !request.name || request.name.toLowerCase()?.includes(keyword.value.toLowerCase()))
    && _entry.timestamp > lastCleared.value
})
const sorted = useSorted(filtered, (a, b) => {
  const _a = Array.isArray(a) ? a[0] : a
  const _b = Array.isArray(b) ? b[0] : b

  return settings.sortOption === 'newest' ? _b.timestamp - _a.timestamp : _a.timestamp - _b.timestamp
})

function getColor(entry: Entry) {
  return TYPE_COLORS[isGQLEntry(entry) ? entry.request.operationType.toUpperCase() : entry.type]
}

function clear() {
  lastCleared.value = Date.now()

  if (!filtered.value.some(entry => [entry].flat()[0].id === active.value))
    active.value = undefined
}
</script>

<template>
  <DefineListItem v-slot="{ entry, color }">
    <Tooltip :content="entry.request.url">
      <li
        class="group relative block w-full cursor-pointer truncate px-3 py-2"
        :class="[
          active === entry.id
            ? entry.response.isError ? 'bg-gray2A text-red11' : 'bg-gray2A text-gray12'
            : entry.response.isError ? 'text-red10 hover:(bg-gray2A text-red11)' : 'text-gray11 hover:(bg-gray2A text-gray12)',
        ]"
        @click="active = entry.id"
      >
        <div
          class="h-5 w-5 inline-flex flex-shrink-0 items-center justify-center rounded font-bold leading-none uppercase"
          :class="active === entry.id ? `bg-${color}9 text-white` : `bg-gray3A group-hover:bg-${color}3A group-hover:text-${color}11 text-gray11 border-gray3A`"
        >
          {{ isGQLEntry(entry) ? entry.request.operationType.at(0) : entry.type.at(0) }}
        </div>
        <span class="ml-2 font-semibold">
          {{ isGQLEntry(entry) && !entry.request.name ? entry.request.operationType : entry.request.name }}
        </span>
        <span v-if="!isGQLEntry(entry)" class="font-semibold opacity-50">{{ entry.request.queryString }}</span>
      </li>
    </Tooltip>
  </DefineListItem>

  <div class="h-full flex flex-col">
    <div class="h-12 flex flex-shrink-0 items-center border-b border-gray3 px-3">
      <Input v-model="keyword" placeholder="Filter" class="w-full" />
    </div>
    <div class="flex-1 flex-grow of-auto border-b border-gray4">
      <ul v-if="sorted.length" class="block flex-grow of-y-auto">
        <template v-for="(entry, i) in sorted" :key="i">
          <li v-if="Array.isArray(entry)">
            <ul class="relative">
              <ReuseListItem
                v-for="(nestedEntry, j) in entry"
                :key="j"
                :entry="nestedEntry"
                :color="getColor(nestedEntry)"
              />
              <template v-if="entry.length > 1">
                <div class="absolute right-4 top-4.25 h-2px w-1.5 rounded-l" :class="entry.some(e => e.id === active) ? 'bg-amber6A' : 'bg-gray4'" />
                <div class="absolute bottom-4.25 right-4 h-2px w-1.5 rounded-l" :class="entry.some(e => e.id === active) ? 'bg-amber6A' : 'bg-gray4'" />
                <div class="absolute right-[calc(1rem-2px)] top-4.25 h-[calc(100%-2rem-2px)] w-2px rounded-r" :class="entry.some(e => e.id === active) ? 'bg-amber6A' : 'bg-gray4'" />
              </template>
            </ul>
          </li>
          <ReuseListItem v-else :entry="entry" :color="getColor(entry)" />
        </template>
      </ul>
      <div v-else class="h-full flex items-center justify-center text-gray9">
        No requests found
      </div>
    </div>
    <div
      class="h-10 flex flex-shrink-0 items-center justify-between px-3"
    >
      <ButtonGroup
        v-model="activeView"
        :items="viewButtons"
        class="flex-shrink-0"
      />
      <Tooltip content="Clear requests">
        <div class="i:disabled shrink-0 cursor-pointer p-1 text-xl text-gray8 hover:text-gray10" @click="clear" />
      </Tooltip>
    </div>
  </div>
</template>
