<script lang="ts" setup>
import { RadioGroupItem, RadioGroupRoot } from 'radix-vue'
import type { ButtonGroupItem } from '~/types'

const {
  size = 'normal',
} = defineProps<{
  items: ButtonGroupItem[]
  activeColor: string
  size: string
}>()

defineSlots<{
  default?: (props: { item: ButtonGroupItem }) => any
}>()

const activeView = defineModel<string>({ required: true })

const initial = activeView.value

function onClick(e: Event, item: any) {
  if (item.name === activeView.value)
    e.preventDefault()
}
</script>

<template>
  <RadioGroupRoot v-model="activeView" :default-value="initial" type="single" class="flex">
    <Tooltip
      v-for="item in items"
      :key="item.name"
    >
      <template #trigger>
        <RadioGroupItem
          :value="item.name"
          class="flex flex-1 items-center justify-center px-2.5 py-2 font-bold first:rounded-l-sm last:rounded-r-sm focus:outline-none"
          :class="[
            { 'text-tiny': size !== 'large' },
            item.name === activeView
              ? activeColor
                ? `bg-${activeColor}4A text-${activeColor}11 dark:bg-${activeColor}3A`
                : 'bg-gray4 text-gray12'
              : 'bg-gray2A text-gray11 hover:bg-gray3A hover:text-gray12',
          ]"
          @click="onClick($event, item)"
        >
          <slot :item="item">
            <span>{{ item.title }}</span>
          </slot>
        </RadioGroupItem>
      </template>
      <span v-if="item.label">{{ item.label }}</span>
    </Tooltip>
  </RadioGroupRoot>
</template>

