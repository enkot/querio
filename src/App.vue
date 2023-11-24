<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'

import 'splitpanes/dist/splitpanes.css'
import { entries, settings } from './composables/store'

const activeId = ref()
const variablesSize = ref(0)
const queryRef = ref<any>(null)
const variablesRef = ref<any>(null)
const responseRef = ref<any>(null)

const active = computed(() => entries.flat().find(item => item?.id === activeId.value))

const bps = useBreakpoints(breakpointsTailwind)

const greaterMd = bps.greaterOrEqual('md')

watch(entries, () => {
  if (settings.newestSelected)
    activeId.value = entries.flat().at(-1)?.id
})

async function toggleVariables(height: number) {
  variablesSize.value = height
}

function onQueryResize(value: number) {
  variablesSize.value = 100 - value
}
</script>

<template>
  <div class="h-screen flex flex-col bg-gray1 md:flex-row">
    <MainPanel class="border-b border-gray4 md:(border-b-0 border-r)" />
    <SplitPane
      :min-size="10"
      :left-size="greaterMd ? 18 : 35"
      class="w-full flex flex-grow of-hidden"
    >
      <template #left>
        <List v-model="activeId" :entries="entries" />
      </template>
      <template #right>
        <div
          v-if="!active"
          class="col-span-8 row-span-6 h-full flex items-center justify-center bg-gray1 md:(col-span-10 row-span-6)"
        >
          <Empty class="h-30" />
        </div>
        <SplitPane
          v-else
          :horizontal="!greaterMd"
          class="flex flex-col of-hidden bg-gray1 md:flex-row"
          :min-size="10"
          :left-size="50"
        >
          <template #left>
            <SplitPane
              horizontal
              class="flex flex-col of-hidden"
              :left-size="100 - variablesSize"
              @resize="onQueryResize"
            >
              <template #left>
                <Query
                  ref="queryRef"
                  :entry="active"
                />
              </template>
              <template v-if="active.request.method !== 'GET'" #right>
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
