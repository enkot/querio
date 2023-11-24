<script lang="ts" setup>
import { SwitchRoot, SwitchThumb } from 'radix-vue'

withDefaults(defineProps<{
  size: string
  equal: boolean
}>(), {
  size: 'normal',
  equal: false,
})

const checked = defineModel<boolean>({ required: true })
</script>

<template>
  <SwitchRoot
    v-model:checked="checked"
    class="relative flex cursor-pointer border border-gray4A rounded-full bg-gray1"
    :class="[
      size === 'tiny' ? 'h-[18px] w-[30px]' : 'h-[20px] w-[36px]',
      equal ? '' : 'data-[state=checked]:bg-gray11',
    ]"
  >
    <SwitchThumb
      class="my-auto ml-1px block rounded-full bg-gray8 shadow-sm transition-transform duration-100 will-change-transform"
      :class="[
        size === 'tiny' ? 'h-3.5 w-3.5 data-[state=checked]:translate-x-3' : 'h-4 w-4 data-[state=checked]:translate-x-4',
        equal ? '' : 'data-[state=checked]:bg-gray-4',
      ]"
    />
  </SwitchRoot>
</template>
