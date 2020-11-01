<template>
  <portal to="modals">
    <div
      v-if="showModal"
      class="fixed px-4 pb-4 inset-0 flex items-center justify-center z-50"
    >
      <transition
        enter-active-class="transition duration-200 ease-in-out"
        leave-active-class="transition duration-200 ease-in-out"
        enter-class="opacity-0"
        leave-to-class="opacity-0"
        appear
        @before-leave="backdropLeaving = true"
        @after-leave="backdropLeaving = false"
      >
        <div v-if="showBackdrop">
          <div class="fixed inset-0 bg-black opacity-25" @click="close()"></div>
        </div>
      </transition>
      <transition
        enter-active-class="transition duration-200 ease-in-out"
        leave-active-class="transition duration-200 ease-in-out"
        enter-class="opacity-0 transform scale-75"
        leave-to-class="opacity-0 transform scale-75"
        appear
        @before-leave="cardLeaving = true"
        @after-leave="cardLeaving = false"
      >
        <template v-if="showContent">
          <slot></slot>
        </template>
      </transition>
    </div>
  </portal>
</template>

<script>
export default {
  model: {
    prop: 'open',
    event: 'close',
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
      showBackdrop: false,
      showContent: false,
      backdropLeaving: false,
      cardLeaving: false,
      isInside: false,
    }
  },
  computed: {
    leaving() {
      return this.backdropLeaving || this.cardLeaving
    },
  },
  watch: {
    open: {
      handler(newValue) {
        if (newValue) {
          this.show()
        } else {
          this.close(false)
        }
      },
      immediate: true,
    },
    leaving(newValue) {
      if (newValue === false) {
        this.showModal = false
      } else {
        this.isInside && this.$emit('close')
      }
    },
  },
  mounted() {
    const onEscape = e => {
      if (this.open && e.keyCode === 27) {
        this.close()
      }
    }
    document.addEventListener('keydown', onEscape)
    this.$once('hook:destroyed', () => {
      document.removeEventListener('keydown', onEscape)
    })
  },
  methods: {
    show() {
      this.showModal = true
      this.showBackdrop = true
      this.showContent = true
    },
    close(isInside = true) {
      this.isInside = isInside
      this.showBackdrop = false
      this.showContent = false
    },
  },
}
</script>
