<script setup lang="ts">
export interface Row {
  name: string
  value?: string
}

withDefaults(defineProps<{
  items: Row[]
}>(), {
  items: () => [],
})
</script>

<template>
  <div class="of-auto -m-[1px]">
    <table class="w-full flex-1 border-collapse">
      <tbody class="w-full">
        <tr v-for="(item, i) in items" :key="i">
          <td
            class="whitespace-nowrap"
          >
            <div class="group relative flex items-center rounded bg-gray2A text-gray12">
              <div class="flex-grow px-2 py-1.5">
                {{ item.name }}
              </div>
              <CopyButton :value="item.name" class="sticky top-0 h-full flex-shrink-0 -right-2 op-0! group-hover:op-100!" />
            </div>
          </td>
          <td
            class="whitespace-nowrap"
          >
            <div class="group relative flex items-center rounded bg-gray2A text-blue12 dark:text-purple12">
              <div class="flex-grow px-2 py-1.5">
                {{ item.value }}
              </div>
              <CopyButton v-if="item.value" :value="item.value" class="sticky top-0 h-full flex-shrink-0 -right-2 op-0! group-hover:op-100!" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
