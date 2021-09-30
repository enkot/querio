<template>
  <div class="flex justify-between h-10 items-center px-3 overflow-hidden flex-shrink-0">
    <div class="flex items-center flex-grow overflow-hidden">
      <ButtonGroup
        :value="value"
        :items="items"
        :activeBgClass="`bg-${color}`"
        class="flex-shrink-0"
        @input="$emit('input', $event)"
      />
      <slot name="left" />
    </div>
    <div class="flex items-center overflow-hidden space-x-1">
      <slot name="right" />
      <Button v-if="showSearch" v-tooltip.bottom="'Find'" @click="$emit('toggleSearch')">
        <SearchIcon class="h-4 w-4" />
      </Button>
      <CopyButton :value="copyValue" class="flex-shrink-0"/>
    </div>
  </div>
</template>

<script>
import SearchIcon from '@/assets/search.svg'

export default {
  components: {
    SearchIcon
  },
  props: {
    value: {
      type: String,
      default: 'data'
    },
    color: {
      type: String,
      default: 'green-400'
    },
    items: {
      type: Array,
      default: () => [
        {
          title: 'DATA',
          name: 'data',
        },
        {
          title: 'HEADERS',
          name: 'headers',
        },
      ]
    },
    copyValue: {
      type: String,
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: false
    }
  },
}
</script>