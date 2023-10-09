<script setup lang="ts">
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue'

defineProps<{
  options: any[]
}>()

const value = defineModel<any>()
</script>

<template>
  <SelectRoot v-model="value">
    <SelectTrigger
      class="placeholder-gray10 text-gray12 min-w-[120px] inline-flex items-center justify-between gap-2 border border-gray4 rounded-sm bg-gray1 px-3 py-2 text-xs"
      aria-label="Customise options"
    >
      <SelectValue placeholder="Select..." />
      <div class="i:chevron-down" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="z-30 w-[150px] border border-gray-5 rounded-sm bg-gray-1 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
        :side-offset="5"
        position="popper"
      >
        <SelectViewport class="p-2">
          <SelectItem
            v-for="(option, index) in options"
            :key="index"
            class="text-gray11 data-[highlighted]:text-gray12 relative flex select-none items-center rounded-sm py-1.5 pl-6 pr-2 text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray4 data-[disabled]:text-gray8 data-[highlighted]:outline-none"
            :value="option.name"
          >
            <SelectItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
              <div class="i:check" />
            </SelectItemIndicator>
            <SelectItemText>
              {{ option.title }}
            </SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
