<script lang="ts" setup>
withDefaults(defineProps<{
  size: string
}>(), {
  size: 'normal',
})

const value = defineModel<string>()
</script>

<template>
  <button
    class="inline-flex items-center justify-center rounded bg-gray3 font-semibold leading-none text-gray11 hover:bg-gray5 focus:outline-none"
    :class="[
      size === 'tiny' ? 'px-2 py-1.25 text-tiny' : 'px-3 py-2 text-xs',
    ]"
  >
    <slot />
  </button>
</template>

