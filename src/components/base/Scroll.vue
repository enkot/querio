<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'radix-vue'
</script>

<template>
  <ScrollAreaRoot class="relative of-hidden" type="auto">
    <ScrollAreaViewport class="h-full w-full">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar orientation="horizontal" class="h-2.5 flex touch-none select-none border-t border-t-transparent p-[1px] transition-colors">
      <ScrollAreaThumb class="bg-gray4A relative flex-1 rounded-full" />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar orientation="vertical" class="h-full w-2.5 flex touch-none select-none border-l border-l-transparent p-[1px] transition-colors">
      <ScrollAreaThumb class="bg-gray4A relative flex-1 rounded-full" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
