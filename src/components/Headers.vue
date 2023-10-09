<script setup lang="ts">
import type { Header } from 'har-format'

withDefaults(defineProps<{
  items: Header[]
}>(), {
  items: () => [],
})
</script>

<template>
  <Scroll class="pb-2">
    <table class="min-w-full">
      <tbody class="divide-y divide-gray3">
        <tr v-for="(item, i) in items" :key="i">
          <td
            class="whitespace-nowrap px-5 py-1.5 font-semibold leading-5 text-gray9"
          >
            {{ item.name }}
          </td>
          <td
            class="text-gray12 whitespace-nowrap px-5 py-1.5 leading-5"
          >
            {{ item.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </Scroll>
</template>
