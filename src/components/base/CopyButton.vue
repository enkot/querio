<template>
  <Button v-tooltip.bottom="{ content }" @click.stop="onCopy">
    <CopyIcon class="h-4 w-4" />
  </Button>
</template>

<script>
import Button from '@/components/base/Button.vue'

import CopyIcon from '@/assets/copy.svg'

export default {
  components: {
    Button,
    CopyIcon
  },
  props: {
    value: {
      required: true
    }
  },
  data() {
    return {
      copied: false
    }
  },
  computed: {
    content() {
      return this.copied ? 'Copied!' : 'Copy'
    }
  },
  methods: {
    onCopy() {
      this.$copyText(this.value).then(() => {
        this.copied = true
        setTimeout(() => this.copied = false, 1500)
      })
    }
  }
}
</script>