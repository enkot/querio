<template>
  <div class="flex">
    <button
      v-for="item in items"
      :key="item.name"
      v-tooltip="item.label"
      class="flex items-center justify-center flex-1 p-2 text-white font-bold leading-none focus:outline-none"
      :class="[
        size === 'large'
          ? 'first:rounded-l last:rounded-r'
          : 'first:rounded-l-sm last:rounded-r-sm text-tiny',
        item.name === value
          ? `${activeBgClass} text-white`
          : 'bg-gray-150 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-750 dark:hover:text-gray-300',
      ]"
      @click="$emit('input', item.name)"
    >
      <slot :item="item">
        <span>{{ item.title }}</span>
      </slot>
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
      default: 'bg-gray-500 dark:bg-gray-600',
    },
    size: {
      type: String,
      default: 'normal',
    },
  },
  watch: {
    items() {},
  },
}
</script>