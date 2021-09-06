<template>
  <button
    @click="$emit('change', !active)"
    class="flex items-center p-1 font-bold uppercase focus:outline-none rounded-sm text-tiny leading-none bg-gray-150 text-gray-500 hover:bg-gray-200 hover:text-gray-400 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-750 dark:hover:text-gray-300 group"
  >
    <span :class="active ? 'text-green-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'">
      <slot name="icon">
        <Check class="h-3.5 w-3.5" />
      </slot>
    </span>
    {{ text }}
  </button>
</template>

<script>
import Check from '@/assets/check.svg'

export default {
  name: "ToggleButton",
  components: {
    Check
  },
  model: {
    prop: 'active',
    event: 'change'
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
