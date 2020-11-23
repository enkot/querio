<template>
  <Scroll>
    <div class="pb-1">
      <table class="min-w-full">
        <tbody class="divide-y divide-gray-200 dark:divide-gray-850">
          <tr v-for="(item, i) in items" :key="i">
            <td
              class="px-3 py-1 whitespace-no-wrap text-xs leading-5 font-medium text-gray-500 dark:text-gray-600"
            >
              {{ item.name }}
            </td>
            <td
              class="px-3 py-1 whitespace-no-wrap text-xs leading-5 text-gray-600 dark:text-gray-500"
            >
              {{ item.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Scroll>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>