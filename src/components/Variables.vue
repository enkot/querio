<template>
  <div
    class="variables-block flex flex-col"
    style="max-height: calc(100% - 2.5rem);"
  >
    <div
      class="flex flex-shrink-0 h-10 items-center px-3 text-gray-550 dark:text-gray-600 hover:text-gray-600 dark-hover:text-gray-500 cursor-pointer"
      @click="toggle"
    >
      <span class="font-bold uppercase">Variables</span>
      <ShevronDown v-if="show" class="h-5" />
      <ShevronUp v-else class="h-5" />
    </div>
    <div v-if="entry && show" class="relative flex-grow pl-1 overflow-hidden">
      <codemirror v-model="variables" class="h-full" />
    </div>
  </div>
</template>

<script>
import ShevronUp from '@/assets/shevron-up.svg'
import ShevronDown from '@/assets/shevron-down.svg'

export default {
  components: {
    ShevronUp,
    ShevronDown,
  },
  props: {
    entry: {
      type: Object,
    },
  },
  computed: {
    variables() {
      return JSON.stringify(this.entry.request.variables, null, 2)
    },
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    toggle() {
      this.show = !this.show
      this.$emit('toggled')
    },
  },
}
</script>
