<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'radix-vue'

defineProps<{
  size: string
}>()

const checked = defineModel<boolean>({ required: true })
</script>

<template>
  <CheckboxRoot
    v-model:checked="checked"
    class="flex appearance-none items-center justify-center border border-gray4A rounded-sm rounded-sm bg-gray1 outline-none hover:border-gray7A data-[state=checked]:bg-gray11 data-[state=checked]:text-gray1"
    :class="[
      size === 'tiny' ? 'h-4 w-4' : 'h-6 w-6',
    ]"
  >
    <CheckboxIndicator class="h-full w-full flex items-center justify-center">
      <div icon="radix-icons:check" class="i:check" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
