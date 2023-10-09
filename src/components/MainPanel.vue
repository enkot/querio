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
    class="h-10 flex justify-between bg-gray2 md:(h-auto w-10 flex-col)"
  >
    <div class="h-12 w-10 flex items-center justify-center">
      <Logo class="h-5 w-5" />
    </div>
    <DialogRoot :open="settingsOpened">
      <Tooltip>
        <template #trigger>
          <DialogTrigger
            class="hover:text-gray11 h-10 w-10 flex items-center justify-center text-gray9 focus:outline-none"
            @click="settingsOpened = true"
          >
            <div class="i:cog h-5 w-5 focus:outline-none" />
          </DialogTrigger>
        </template>
        <span>Settings</span>
      </Tooltip>
      <DialogPortal>
        <DialogOverlay class="dialog-overlay" />
        <DialogContent
          class="dialog-content"
        >
          <DialogTitle class="text-gray12 m-0 text-lg font-semibold">
            Settings
          </DialogTitle>
          <DialogDescription class="text-gray10 mb-5 leading-normal">
            Manage your settings here.
          </DialogDescription>
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between space-x-2">
              <label class="text-gray-11 flex flex-col text-left text-sm font-medium space-y-0.5">Theme</label>
              <ButtonGroup
                v-model="colorMode"
                :items="themeOptions"
                class="flex-shrink-0"
              />
            </div>
            <div class="flex items-center justify-between space-x-2">
              <label class="text-gray-11 flex flex-col text-left text-sm font-medium space-y-0.5">Requests sorting</label>
              <Select
                v-model="settings.sortOption"
                :options="sortOptions"
                class="flex-shrink-0"
              />
            </div>
            <div class="flex items-center justify-between space-x-2">
              <label for="autoselect" class="text-gray-11 flex flex-col text-left text-sm font-medium space-y-0.5">
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
                class="text-gray11 bg-gray3A inline-flex items-center justify-center rounded-sm px-3 py-2 font-semibold leading-none hover:bg-gray5 focus:shadow-[0_0_0_2px] focus:shadow-gray7 focus:outline-none"
              >
                Cancel
              </button>
            </DialogClose>
            <DialogClose as-child>
              <button
                class="text-pink11 bg-pink3A inline-flex items-center justify-center rounded-sm px-3 py-2 font-semibold leading-none hover:bg-pink5 focus:shadow-[0_0_0_2px] focus:shadow-pink7 focus:outline-none"
              >
                Save changes
              </button>
            </DialogClose>
          </div>
          <DialogClose
            class="text-gray11 absolute right-[10px] top-[10px] h-[25px] w-[25px] inline-flex appearance-none items-center justify-center rounded-full hover:bg-gray4 focus:shadow-[0_0_0_2px] focus:shadow-gray7 focus:outline-none"
            aria-label="Close"
          >
            <div class="i:close" />
          </DialogClose>
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
  @apply fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-gray2 border border-gray-4 px-6 py-4 focus:outline-none z-20;
}
</style>
