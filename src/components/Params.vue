<template>
  <div class="space-y-2 font-medium">
    <div
      v-for="{ name, value } in items"
      :key="name"
      class="flex items-center w-full"
    >
      <div
        class="flex-1 px-2 py-1.5 rounded bg-gray-200 dark:bg-gray-850 text-property dark:text-property-light"
      >
        {{ name }}
      </div>
      <ArrowRight class="h-3 w-3 mx-2 text-gray-500 dark:text-gray-600" />
      <div
        class="flex-1 px-2 py-1.5 rounded bg-gray-200 dark:bg-gray-850"
        :class="
          typeof value === 'string'
            ? 'text-operator dark:text-operator-light'
            : 'text-atom dark:text-atom-light'
        "
      >
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script>
import ArrowRight from '@/assets/arrow-right.svg'

export default {
  components: {
    ArrowRight,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>