<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

import 'splitpanes/dist/splitpanes.css'

const props = withDefaults(defineProps<{
  /**
   * The key to use for storing the pane sizes in localStorage.
   */
  storageKey?: string
  stateKey?: string
  leftSize?: number
  minSize?: number
  horizontal?: boolean
}>(), {
  stateKey: 'querio-panels-state',
})

const emit = defineEmits<{
  resize: [size: number]
  resized: [size: number]
}>()

const DEFAULT = 16
const size = ref(props.leftSize || DEFAULT)

watch(() => props.leftSize, (v) => {
  if (v !== undefined)
    size.value = v
})

function onResize(event: any) {
  size.value = event.at(0).size

  emit('resize', size.value)
}

function onResized(event: any) {
  size.value = event.at(0).size

  emit('resized', size.value)
}
</script>

<template>
  <Splitpanes :horizontal="horizontal" h-full of-hidden @resize="onResize" @resized="onResized">
    <Pane h-full w-full class="min-h-[2.5rem]" :size="size" :min-size="$slots.right ? (minSize || 0) : 100">
      <slot name="left" />
    </Pane>
    <Pane v-if="$slots.right" :size="100 - size" relative h-full class="min-h-[2.5rem]" :min-size="minSize || 0">
      <slot name="right" />
    </Pane>
  </Splitpanes>
</template>

<style>
.splitpanes .splitpanes__pane {
  transition: none;
}
.splitpanes__splitter {
  position: relative;
}
.splitpanes__splitter:before {
  @apply transition ease-in-out;
  position: absolute;
  left: 0;
  top: 0;
  content: '';
  z-index: 1;
}
.splitpanes__splitter:hover:before {
  @apply bg-indigo-500;
  opacity: 0.8;
}
.splitpanes--vertical>.splitpanes__splitter {
  min-width: 0 !important;
  width: 0 !important;
  @apply border-r border-gray4;
}
.splitpanes--horizontal>.splitpanes__splitter {
  min-height: 0 !important;
  height: 0 !important;
  @apply border-t border-gray4;
}
.splitpanes--vertical>.splitpanes__splitter:before {
  left: -2px;
  right: -2px;
  height: 100%;
}
.splitpanes--horizontal>.splitpanes__splitter:before {
  top: -2px;
  bottom: -2px;
  width: 100%;
}
</style>
