<script lang="ts" setup>
const { items = [] } = defineProps<{
  items: {
    name: string
    value: string
  }[]
}>()
</script>

<template>
  <div class="font-medium space-y-2">
    <div
      v-for="{ name, value } in items"
      :key="name"
      class="w-full flex items-center"
    >
      <div
        class="text-gray12 bg-gray2A flex-1 rounded px-2 py-1.5 text-property"
      >
        {{ name }}
      </div>
      <template v-if="value">
        <div class="i:arrow-right mx-2 h-3 w-3 text-gray6" />
        <div class="text-pink12 bg-gray2A flex-1 rounded px-2 py-1.5">
          {{ value }}
        </div>
      </template>
    </div>
  </div>
</template>
