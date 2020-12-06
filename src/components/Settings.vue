<template>
  <Modal :open="open" @close="$emit('close')">
    <div
      class="w-full max-w-sm mx-auto rounded p-6 z-50 space-y-4 shadow-lg bg-white dark:bg-gray-850"
    >
      <div>
        <h2 class="text-sm text-gray-600 dark:text-gray-400">Theme</h2>
        <ButtonGroup
          v-model="currentColorMode"
          v-slot="{ item }"
          :items="colorModes"
          size="large"
          activeBgClass="bg-indigo-700"
          class="flex flex-shrink-0 w-full mt-2"
          @input="changeColorMode"
        >
          <component :is="item.icon" class="w-3 h-3" />
          <span class="ml-1">{{ item.title }}</span>
        </ButtonGroup>
      </div>
      <div>
        <h2 class="text-sm text-gray-600 dark:text-gray-400">Sorting</h2>
        <ButtonGroup
          v-model="currentSortOption"
          v-slot="{ item }"
          :items="sortOptions"
          size="large"
          activeBgClass="bg-gray-500 dark:bg-gray-700"
          class="flex flex-shrink-0 w-full mt-2"
          @input="changeSortOption"
        >
          <span class="ml-1">{{ item.title }}</span>
        </ButtonGroup>
      </div>
    </div>
  </Modal>
</template>

<script>
import SparklesIcon from '@/assets/sparkles.svg'
import DesktopIcon from '@/assets/desktop.svg'
import SunIcon from '@/assets/sun.svg'
import MoonIcon from '@/assets/moon.svg'

export default {
  components: {
    SparklesIcon,
    DesktopIcon,
    SunIcon,
    MoonIcon,
  },
  model: {
    prop: 'open',
    event: 'close',
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    settings: {
      type: Object,
      default: () => ({
        colorMode: 'Auto',
      }),
    },
  },
  data() {
    return {
      sortOptions: [
        {
          title: 'Newest first',
          name: 'newest',
        },
        {
          title: 'Oldest first',
          name: 'oldest',
        },
      ],
      colorModes: [
        {
          icon: 'SparklesIcon',
          title: 'Auto',
          name: 'Auto',
        },
        {
          icon: 'SunIcon',
          title: 'Light',
          name: 'Light',
        },
        {
          icon: 'MoonIcon',
          title: 'Dark',
          name: 'Dark',
        },
      ],
      currentSortOption: 'newest',
      currentColorMode: 'Auto',
    }
  },
  created() {
    this.currentColorMode = this.settings.colorMode
    this.currentSortOption = this.settings.sortOption
  },
  methods: {
    changeColorMode(value) {
      this.currentColorMode = value
      this.updateSettings('colorMode', value)
    },
    changeSortOption(value) {
      this.currentSortOption = value
      this.updateSettings('sortOption', value)
    },
    updateSettings(name, value) {
      this.$emit('update:settings', {
        ...this.settings,
        [name]: value,
      })
    },
  },
}
</script>

<style>
</style>