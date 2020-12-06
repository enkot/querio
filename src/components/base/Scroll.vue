<template>
  <vue-scroll
    v-if="settings.colorTheme === 'dark'"
    key="dark"
    :ops="options.dark"
  >
    <slot />
  </vue-scroll>
  <vue-scroll v-else key="light" :ops="options.light">
    <slot />
  </vue-scroll>
</template>

<script>
import { mapState } from 'vuex'
import tailwind from '../../../tailwind.config'

const { gray } = tailwind.theme.extend.colors

export default {
  props: {
    scrollingX: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState(['settings']),
    options() {
      return {
        dark: {
          bar: {
            background: gray['800'],
          },
          scrollPanel: {
            scrollingX: this.scrollingX,
          },
        },
        light: {
          bar: {
            background: gray['250'],
          },
          scrollPanel: {
            scrollingX: this.scrollingX,
          },
        },
      }
    },
  },
}
</script>