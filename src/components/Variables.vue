<script lang="ts" setup>
import type { Entry } from '~/types'
import { formatData } from '~/utils'

const props = defineProps<{
  entry: Entry
}>()

const emit = defineEmits<{
  toggle: [value: number]
}>()

const open = defineModel<boolean>('open', { local: true })

const HEIGHT_COLLAPSED = 2.5 * 16 // 2.5rem

const elRef = ref(null)
const codeRef = ref<any>(null)

const params = computed(() => isGQLEntry(props.entry) ? null : props.entry.request.params)
const body = computed(() => isGQLEntry(props.entry) ? null : formatData(props.entry.request.body, 'text/json'))
const variables = computed(() => isGQLEntry(props.entry) ? formatData(props.entry.request.variables, 'text/json') : null)

useResizeObserver(elRef, ([entry]) => {
  open.value = entry.contentRect.height !== HEIGHT_COLLAPSED
})

function toggle() {
  open.value = !open.value
  emit('toggle', open.value ? 50 : 0)
}

defineExpose({
  refresh() {
    codeRef.value?.refresh()
  },
})
</script>

<template>
  <div ref="elRef" class="variables-block flex flex-col">
    <div
      class="group h-10 flex flex-shrink-0 cursor-pointer items-center justify-between px-3"
      @click="toggle"
    >
      <div
        class="flex flex-shrink-0 items-center text-gray10 group-hover:text-gray11"
      >
        <span class="font-bold uppercase">
          {{ isGQLEntry(entry) ? 'Variables' : 'Body' }}
        </span>
        <div class="i:chevron-up transform text-xl" :class="{ 'rotate-180': open }" />
      </div>
      <div class="flex items-center of-hidden space-x-1">
        <div
          v-if="!isGQLEntry(entry)"
          class="hide-scrollbar ml-2 of-auto whitespace-nowrap text-gray10"
        >
          {{ entry.request.mimeType }}
        </div>
      </div>
    </div>
    <div v-if="entry" class="relative flex flex-1 flex-col of-hidden border-t border-gray3">
      <Table v-if="params" :items="params" class="px-3 py-3" />
      <Code v-else ref="codeRef" :code="variables || body" class="of-auto" />
    </div>
  </div>
</template>
