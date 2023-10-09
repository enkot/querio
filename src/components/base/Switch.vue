<script lang="ts" setup>
import { SwitchRoot, SwitchThumb } from 'radix-vue'

const checked = defineModel<boolean>({ required: true })
</script>

<template>
  <SwitchRoot
    v-model:checked="checked"
    class="data-[state=checked]:bg-gray11 relative h-[20px] w-[36px] flex cursor-default border-2 border-transparent rounded-full bg-gray5 focus-within:outline-black focus-within:outline"
  >
    <SwitchThumb
      class="my-auto block h-4 w-4 rounded-full bg-gray1 shadow-sm transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-4"
    />
  </SwitchRoot>
</template>
