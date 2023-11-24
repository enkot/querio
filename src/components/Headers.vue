<script setup lang="ts">
import type { Header } from 'har-format'

withDefaults(defineProps<{
  items: Header[]
}>(), {
  items: () => [],
})
</script>

<template>
  <div class="of-auto px-3 py-1">
    <table class="w-full flex-1 border-collapse">
      <tbody class="w-full">
        <tr v-for="(item, i) in items" :key="i">
          <td
            class="whitespace-nowrap"
          >
            <div class="rounded-sm bg-gray2A px-2 py-1.5 text-gray12">
              {{ item.name }}
            </div>
          </td>
          <td
            class="whitespace-nowrap"
          >
            <div class="rounded-sm bg-gray2A px-2 py-1.5 text-blue12 dark:text-purple12">
              {{ item.value }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
