<script lang="ts" setup>
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'radix-vue'

withDefaults(defineProps<{
  content?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}>(), {
  side: 'top',
})
</script>

<template>
  <TooltipProvider v-if="content" :delay-duration="1200" disable-hoverable-content>
    <TooltipRoot disable-closing-trigger>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          as-child
          :side="side"
          class="select-none rounded bg-gray12 px-2.5 py-1.5 leading-none text-gray-1 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]"
          :side-offset="5"
        >
          <ul>
            {{ content }}
            <TooltipArrow class="fill-gray12" size="8" />
          </ul>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
  <slot v-else />
</template>
