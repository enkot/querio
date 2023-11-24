<script lang="ts" setup>
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'radix-vue'
import Logo from '../assets/logo-small.svg?component'
import { colorMode } from '~/composables/store'

const settingsOpened = ref(false)
const activeTheme = ref('auto')

colorMode.value = 'dark'
const themeOptions = [
  {
    title: 'AUTO',
    name: 'auto',
  },
  {
    title: 'LIGHT',
    name: 'light',
  },
  {
    title: 'DARK',
    name: 'dark',
  },
]
const sortOptions = [
  {
    title: 'Newest first',
    name: 'newest',
  },
  {
    title: 'Oldest first',
    name: 'oldest',
  },
]
</script>

<template>
  <div
    class="h-10 flex justify-between bg-gray1 md:(h-auto w-10 flex-col)"
  >
    <div class="h-10 w-10 flex items-center justify-center text-gray11A">
      <Logo class="h-4.5 w-4.5" />
    </div>
    <DialogRoot v-model:open="settingsOpened">
      <Tooltip content="Settings">
        <DialogTrigger
          class="h-10 w-10 flex items-center justify-center text-gray9 hover:text-gray11 focus:outline-none"
          @click="settingsOpened = true"
        >
          <div class="i:cog h-5 w-5 focus:outline-none" />
        </DialogTrigger>
      </Tooltip>
      <DialogPortal>
        <DialogOverlay class="dialog-overlay" />
        <DialogContent
          class="dialog-content"
        >
          <DialogTitle class="m-0 text-lg font-semibold text-gray12">
            Settings
          </DialogTitle>
          <DialogDescription class="mb-5 leading-normal text-gray10">
            Manage your settings here.
          </DialogDescription>
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between space-x-2">
              <label class="flex flex-col text-left text-sm font-medium text-gray-11 space-y-0.5">Theme</label>
              <ButtonGroup
                v-model="colorMode"
                :items="themeOptions"
                class="flex-shrink-0"
              />
            </div>
            <div class="flex items-center justify-between space-x-2">
              <label class="flex flex-col text-left text-sm font-medium text-gray-11 space-y-0.5">Requests sorting</label>
              <Select
                v-model="settings.sortOption"
                :options="sortOptions"
                class="flex-shrink-0"
              />
            </div>
            <div class="flex items-center justify-between space-x-2">
              <label for="autoselect" class="flex flex-col text-left text-sm font-medium text-gray-11 space-y-0.5">
                Autoselect newest request
              </label>
              <Switch
                id="autoselect"
                v-model="settings.newestSelected"
                class="flex-shrink-0"
              />
            </div>
          </div>
          <div class="mt-[25px] flex justify-end gap-2">
            <DialogClose as-child>
              <button
                class="inline-flex items-center justify-center border border-pink3A rounded bg-pink3A px-3 py-2 font-semibold leading-none text-pink11 hover:bg-pink5 focus:shadow-[0_0_0_2px] focus:shadow-pink7 focus:outline-none"
              >
                Save changes
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>

<style>
.dialog-overlay {
  @apply fixed inset-0 bg-black/60 backdrop-blur-sm z-20;
}

.dialog-content {
  @apply fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-gray2 border border-gray-4 px-6 py-4 focus:outline-none z-20 of-y-auto;
}
</style>
