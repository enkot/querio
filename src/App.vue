<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'

import 'splitpanes/dist/splitpanes.css'
import Ghost from './assets/ghost.svg?component'
import { entries, settings } from './composables/store'

const activeId = ref()
const variablesSize = ref(0)
const queryRef = ref<any>(null)
const variablesRef = ref<any>(null)
const responseRef = ref<any>(null)

const active = computed(() => entries.find(item => item?.id === activeId.value))

const bps = useBreakpoints({
  md: breakpointsTailwind.md,
  lg: Infinity,
})

watch(entries, () => {
  if (settings.newestSelected)
    activeId.value = entries.at(-1)?.id
})

function getValueByBp(obj: Record<'md' | 'lg', any>): string | null {
  return Object.entries(obj).reduce((_acc, [key, value]) => {
    if (bps.greaterOrEqual(key as keyof typeof obj))
      return value
    return null
  }, null)
}

async function toggleVariables(height: number) {
  variablesSize.value = height

  await nextTick()

  queryRef.value?.refresh()
  variablesRef.value?.refresh()
}

function onResized() {
  queryRef.value?.refresh()
  variablesRef.value?.refresh()
  responseRef.value?.refresh()
}

function onQueryResize(value: number) {
  variablesSize.value = 100 - value
}
</script>

<template>
  <div class="h-screen flex flex-col bg-gray2 md:flex-row">
    <MainPanel class="border-b border-gray4 md:(border-b-0 border-r)" />
    <SplitPane
      :min-size="10"
      :left-size="getValueByBp({ md: 35, lg: 16 })"
      class="w-full flex flex-grow of-hidden"
      @resized="onResized"
    >
      <template #left>
        <List v-model="activeId" :entries="entries" />
      </template>
      <template #right>
        <div
          v-if="!active"
          class="col-span-8 row-span-6 h-full flex items-center justify-center bg-gray1 md:(col-span-10 row-span-6)"
        >
          <Ghost class="h-40" />
        </div>
        <SplitPane
          v-else
          :horizontal="getValueByBp({ md: true, lg: false })"
          class="flex flex-col of-hidden bg-gray1 md:flex-row"
          :min-size="10"
          :left-size="50"
          @resized="onResized"
        >
          <template #left>
            <SplitPane
              horizontal
              class="flex flex-col of-hidden"
              :left-size="100 - variablesSize"
              @resize="onQueryResize"
              @resized="onResized"
            >
              <template #left>
                <Query
                  ref="queryRef"
                  :entry="active"
                />
              </template>
              <template #right>
                <Variables
                  ref="variablesRef"
                  :open="false"
                  :entry="active"
                  class="h-full of-hidden"
                  @toggle="toggleVariables"
                />
              </template>
            </SplitPane>
          </template>
          <template #right>
            <Response ref="responseRef" :entry="active" />
          </template>
        </SplitPane>
      </template>
    </SplitPane>
  </div>
</template>
