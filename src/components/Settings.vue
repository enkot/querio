<template>
  <BaseModal :open="open" @close="$emit('close')">
    <div
      class="w-full max-w-sm mx-auto rounded p-6 z-50 shadow-lg bg-white dark:bg-gray-850"
    >
      <h2 class="text-sm text-gray-600 dark:text-gray-400">Theme</h2>
      <div class="flex mt-2 space-x-2">
        <button
          v-for="{ title, icon } in colorModes"
          :key="title"
          class="flex items-center justify-center flex-1 py-2 px-2 rounded focus:outline-none"
          :class="
            currentColorMode === title
              ? 'text-white bg-indigo-700'
              : 'text-gray-600 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 hover:text-gray-800 dark-hover:text-white'
          "
          @click="changeColorMode(title)"
        >
          <component :is="icon" class="w-4 h-4" />
          <span class="ml-1">{{ title }}</span>
        </button>
      </div>
    </div>
  </BaseModal>
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
      colorModes: [
        {
          icon: 'SparklesIcon',
          title: 'Auto',
        },
        {
          icon: 'SunIcon',
          title: 'Light',
        },
        {
          icon: 'MoonIcon',
          title: 'Dark',
        },
      ],
      currentColorMode: 'Auto',
    }
  },
  created() {
    this.currentColorMode = this.settings.colorMode
  },
  methods: {
    changeColorMode(colorMode) {
      this.currentColorMode = colorMode
      this.$emit('update:settings', {
        ...this.settings,
        colorMode,
      })
    },
  },
}
</script>

<style>
</style>