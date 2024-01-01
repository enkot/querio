<script lang="ts" setup>
import { RadioGroupItem, RadioGroupRoot } from 'radix-vue'
import type { ButtonGroupItem } from '~/types'

const {
  size = 'normal',
} = defineProps<{
  items: ButtonGroupItem[]
  activeColor?: string
  size?: string
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
      v-for="(item, i) in items"
      :key="item.name"
      :content="item.label"
    >
      <RadioGroupItem
        :value="item.name"
        class="box-border flex flex-1 items-center justify-center px-2 py-1.5 font-bold focus:outline-none"
        :class="[
          { 'text-tiny': size !== 'large' },
          // { 'border-r': items.at(i + 1)?.name !== activeView },
          // { 'border-x': item.name === activeView },
          { 'rounded-l': i === 0 },
          { 'rounded-r': i === items.length - 1 },
          item.name === activeView
            ? activeColor
              ? `bg-${activeColor}9 text-white`
              : 'bg-gray5 text-gray12'
            : 'bg-gray3 text-gray11 hover:(bg-gray4 text-gray12)',
        ]"
        @click="onClick($event, item)"
      >
        <slot :item="item">
          <span>{{ item.title }}</span>
        </slot>
      </RadioGroupItem>
    </Tooltip>
  </RadioGroupRoot>
</template>

