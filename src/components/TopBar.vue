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
  hasPreflight = false,
  showSearch = false,
} = defineProps<{
  color?: string
  items?: ButtonGroupItem[]
  copyValue?: string
  showSearch?: boolean
  hasPreflight?: boolean
}>()

defineEmits<{
  (e: 'toggleSearch'): void
}>()

const activeView = defineModel({ default: 'data' })
const preflight = defineModel('preflight', { default: false })
</script>

<template>
  <div class="h-12 flex flex-shrink-0 items-center justify-between of-hidden border-b border-gray3 bg-gray1 px-3">
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
      <div v-if="activeView === 'headers' && hasPreflight" class="flex items-center">
        <label class="cursor-pointer p-1 text-tiny font-bold uppercase" :class="!preflight ? 'text-gray11' : 'text-gray8'" for="preflight">
          Main
        </label>
        <Switch id="preflight" v-model="preflight" size="tiny" equal />
        <label class="cursor-pointer p-1 text-tiny font-bold uppercase" :class="preflight ? 'text-gray11' : 'text-gray8'" for="preflight">
          Preflight
        </label>
      </div>
    </div>
  </div>
</template>
