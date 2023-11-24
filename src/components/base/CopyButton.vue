<script lang="ts" setup>
import { clipboard } from '@extend-chrome/clipboard'

const props = defineProps<{
  value: string
}>()

defineOptions({
  inheritAttrs: false,
})

const copied = ref(false)

async function copy() {
  clipboard.writeText(props.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <Tooltip content="Copy">
    <div class="flex cursor-pointer items-center justify-center rounded p-1.5 text-gray7 hover:bg-gray3A hover:text-gray11" v-bind="$attrs" @click="copy">
      <div class="text-base" :class="copied ? 'i:check' : 'i:copy'" />
    </div>
  </Tooltip>
</template>
