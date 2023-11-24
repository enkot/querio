<script setup lang="ts">
import { Toggle } from 'radix-vue'
import { ref } from 'vue'

withDefaults(defineProps<{
  size: string
}>(), {
  size: 'normal',
})

const toggleState = defineModel<boolean>()
</script>

<template>
  <Toggle
    v-model:pressed="toggleState"
    class="flex flex-1 items-center justify-center border rounded px-2 py-2 font-bold focus:outline-none"
    :class="[
      { 'text-tiny': size !== 'large' },
      toggleState
        ? 'bg-gray3A text-gray12 border-gray3A'
        : 'bg-gray1 text-gray10 hover:(bg-gray3A text-gray11) border-transparent',
    ]"
  >
    <slot />
  </Toggle>
</template>
