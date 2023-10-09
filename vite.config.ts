import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import unocss from 'unocss/vite'
import svgLoader from 'vite-svg-loader'
import { r } from './scripts/utils'
import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue({
      script: {
        // @ts-expect-error - this is a valid option
        defineModel: true,
      },
    }),
    autoImport({
      imports: [
        'vue',
        '@vueuse/core',
        {
          'webextension-polyfill': [
            ['*', 'browser'],
          ],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
      dirs: ['src/composables', 'src/utils'],
      vueTemplate: true,
    }),
    components({
      dirs: [r('src/components')],
      // generate `components.d.ts` for ts support with Volar
      dts: r('src/components.d.ts'),
    }),
    unocss(),
    svgLoader(),
    crx({ manifest }),
  ],
})
