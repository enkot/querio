<template>
  <vue-scroll
    v-if="settings.colorTheme === 'dark'"
    key="dark"
    :ops="scrollOptionsDark"
  >
    <slot />
  </vue-scroll>
  <vue-scroll v-else key="light" :ops="scrollOptionsLight">
    <slot />
  </vue-scroll>
</template>

<script>
import { mapState } from 'vuex'
import tailwind from '../../../tailwind.config'

export default {
  data() {
    const { gray } = tailwind.theme.extend.colors

    return {
      scrollOptionsDark: {
        bar: {
          background: gray['800'],
        },
      },
      scrollOptionsLight: {
        bar: {
          background: gray['300'],
        },
      },
    }
  },
  computed: {
    ...mapState(['settings']),
  },
  // methods: {
  //   refresh() {
  //     this.$refs.scroll && this.$refs.scroll.refresh()
  //   },
  // },
  // watch: {
  //   async 'settings.colorTheme'() {
  //     await this.$nextTick()
  //     this.refresh()
  //   },
  // },
}
</script>