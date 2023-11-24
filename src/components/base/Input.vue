<script lang="ts" setup>
withDefaults(defineProps<{
  size: string
}>(), {
  size: 'normal',
})

const value = defineModel<string>()
const inputRef = ref<HTMLInputElement | null>(null)

function select() {
  inputRef.value?.focus()
  inputRef.value?.select()
}

defineExpose({
  select,
})
</script>

<template>
  <input
    ref="inputRef"
    v-model="value"
    type="text"
    class="border border-gray5A rounded bg-gray1 text-xs text-gray12 focus-visible:border-gray6 focus:outline-none placeholder-gray10"
    :class="[
      size === 'tiny' ? 'px-1.5 py-0.75' : 'px-3 py-1.75',
    ]"
  >
</template>
