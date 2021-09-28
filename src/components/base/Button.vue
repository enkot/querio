<template>
  <button
    class="flex items-center p-1 font-bold uppercase focus:outline-none rounded-sm text-tiny leading-none bg-transparent text-gray-500 hover:bg-gray-150 active:bg-gray-200 hover:text-gray-600 dark:text-gray-500 dark:bg-transparent dark:hover:bg-gray-750 dark:active:bg-gray-700 dark:hover:text-gray-300 group"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>