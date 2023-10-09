<script lang="ts" setup>
import type { Entry } from '~/types'

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
const body = computed(() => isGQLEntry(props.entry) ? null : JSON.stringify(props.entry.request.body, null, 2))
const variables = computed(() => isGQLEntry(props.entry) ? JSON.stringify(props.entry.request.variables, null, 2) : null)

useResizeObserver(elRef, ([entry]) => {
  open.value = entry.contentRect.height !== HEIGHT_COLLAPSED
})

function toggle() {
  open.value = !open.value
  emit('toggle', open.value ? 33 : 0)
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
        class="group-hover:text-gray11 text-gray10 flex flex-shrink-0 items-center"
      >
        <span class="font-bold uppercase">
          {{ isGQLEntry(entry) ? 'Variables' : 'Body' }}
        </span>
        <div class="text-xl" :class="open ? 'i:chevron-down' : 'i:chevron-up'" />
      </div>
      <div class="flex items-center of-hidden space-x-1">
        <div
          v-if="!isGQLEntry(entry)"
          class="hide-scrollbar text-gray10 ml-2 of-auto whitespace-nowrap"
        >
          {{ entry.request.mimeType }}
        </div>
        <CopyButton :value="params || variables || body" />
      </div>
    </div>
    <div v-if="entry" class="relative flex-grow of-hidden">
      <Scroll v-if="params">
        <Params :items="params" class="px-3 pb-3" />
      </Scroll>
      <Code v-else ref="codeRef" :value="variables || body" class="h-full pl-1" />
    </div>
  </div>
</template>
