<template>
  <div>
    <button
      v-for="item in items"
      :key="item.name"
      class="p-2 first:rounded-l-sm last:rounded-r-sm text-tiny text-white font-semibold uppercase leading-none focus:outline-none"
      :class="
        item.name === value
          ? `${activeBgClass} text-white`
          : 'bg-gray-200 dark:bg-gray-800 text-gray-550 hover:bg-gray-300 hover:text-gray-600 dark-hover:bg-gray-700 dark-hover:text-gray-500'
      "
      @click="$emit('input', item.name)"
    >
      {{ item.title }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
    },
    items: {
      type: Array,
    },
    activeBgClass: {
      type: String,
      default: 'bg-gray-600',
    },
  },
  watch: {
    items() {},
  },
}
</script>