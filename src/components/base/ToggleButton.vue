<template>
  <Button @click="$emit('change', !active)">
    <span :class="active ? 'text-green-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'">
      <slot name="icon">
        <Check class="h-4 w-4" />
      </slot>
    </span>
    {{ text }}
  </Button>
</template>

<script>
import Button from './Button.vue'
import Check from '@/assets/check.svg'

export default {
  name: "ToggleButton",
  components: {
    Button,
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
