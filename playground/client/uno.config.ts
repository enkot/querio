import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  shortcuts: {
    btn: 'bg-gray-900 hover:bg-gray-950 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto',
  },
})
