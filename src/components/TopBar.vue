<script lang="ts" setup>
import type { ButtonGroupItem } from '~/types'

const {
  color = 'green-400',
  items = [
    {
      title: 'DATA',
      name: 'data',
    },
    {
      title: 'HEADERS',
      name: 'headers',
    },
  ],
  copyValue = '',
  showSearch = false,
} = defineProps<{
  color?: string
  items?: ButtonGroupItem[]
  copyValue?: string
  showSearch?: boolean
}>()

defineEmits<{
  (e: 'toggleSearch'): void
}>()

const activeView = defineModel({ default: 'data' })
</script>

<template>
  <div class="h-10 flex flex-shrink-0 items-center justify-between of-hidden border-b border-gray3 bg-gray1 px-2">
    <div class="flex items-center of-hidden">
      <ButtonGroup
        v-model="activeView"
        :items="items"
        :active-color="color"
        class="flex-shrink-0"
      />
      <slot name="left" />
    </div>
    <div class="flex flex-shrink-0 items-center of-hidden space-x-1">
      <slot name="right" />
    </div>
  </div>
</template>
