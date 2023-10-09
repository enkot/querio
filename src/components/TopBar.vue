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

const modelValue = defineModel({ default: 'data' })
</script>

<template>
  <div class="h-12 flex flex-shrink-0 items-center justify-between of-hidden bg-gray1 px-3">
    <div class="flex flex-grow items-center of-hidden">
      <ButtonGroup
        v-model="modelValue"
        :items="items"
        :active-color="color"
        class="flex-shrink-0"
      />
      <slot name="left" />
    </div>
    <div class="flex flex-shrink-0 items-center of-hidden space-x-1">
      <slot name="right" />
      <Button v-if="showSearch" v-tooltip.bottom="'Find'" @click="$emit('toggleSearch')">
        <SearchIcon class="h-4 w-4" />
      </Button>
      <CopyButton :value="copyValue" class="flex-shrink-0" />
    </div>
  </div>
</template>
