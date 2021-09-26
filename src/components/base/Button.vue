<template>
  <button
    class="flex items-center p-1 font-bold uppercase focus:outline-none rounded-sm text-tiny leading-none bg-white text-gray-500 hover:bg-gray-150 hover:text-gray-600 dark:text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-750 dark:hover:text-gray-300 group"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>