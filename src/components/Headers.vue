<template>
  <table class="min-w-full">
    <tbody>
      <tr v-for="(item, i) in items" :key="i">
        <td
          class="px-3 py-1 whitespace-no-wrap text-xs leading-5 border-b border-gray-200 dark:border-gray-850 font-medium text-gray-500 dark:text-gray-600"
        >
          {{ item.name }}
        </td>
        <td
          class="px-3 py-1 whitespace-no-wrap text-xs leading-5 border-b border-gray-200 dark:border-gray-850 text-gray-600 dark:text-gray-500"
        >
          {{ item.value }}
        </td>
      </tr>
    </tbody>
  </table>
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