<script lang="ts" setup>
import { clipboard } from '@extend-chrome/clipboard'

const props = defineProps<{
  value: string
}>()

const copied = false

async function copy() {
  clipboard.writeText(props.value)
}
</script>

<template>
  <Button v-tooltip.bottom="copied ? 'Copied!' : 'Copy'" @click="copy()">
    copy
  </Button>
</template>
