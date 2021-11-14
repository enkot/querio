import Vue from 'vue'
import PortalVue from 'portal-vue'
import 'codemirror-graphql/mode'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/selection/active-line.js'

import VueClipboard from 'vue-clipboard2'
import VueCodemirror from 'vue-codemirror'
import VueHotkey from 'v-hotkey'
import Vuescroll from 'vuescroll'
import VTooltip from 'v-tooltip'
import VueMq from 'vue-mq'
import 'v-tooltip/dist/v-tooltip.css'

import App from './App.vue'
import store from '@/store'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/fold/foldgutter.css'
import '@/assets/tooltip.css'
import '@/assets/tailwind.css'
import '@/assets/custom-dracula.css'
import '@/components/base'
import defaultConfig from 'tailwindcss/defaultConfig'

Vue.use(VueClipboard)
Vue.use(VueHotkey)
Vue.use(VueMq, {
  breakpoints: {
    md: parseInt(defaultConfig.theme.screens.md),
    lg: Infinity,
  },
})
Vue.use(VTooltip, {
  themes: {
    tooltip: {
      placement: 'bottom',
      delay: {
        show: 300,
        hide: 100,
      },
    }
  }
})
Vue.use(PortalVue)
Vue.use(Vuescroll, {
  ops: {
    bar: {
      keepShow: true,
    },
    rail: {
      gutterOfSide: 0,
    },
  },
})
Vue.use(VueCodemirror, {
  options: {
    mode: {
      name: 'javascript',
      json: true,
    },
    theme: 'dracula',
    tabSize: 4,
    foldGutter: true,
    styleActiveLine: true,
    lineNumbers: true,
    readOnly: true,
    scrollbarStyle: 'overlay',
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    dialogOptions: {
      closeOnEnter: false
    },
    foldOptions: {
      widget() {
        const widget = document.createElement('div')
        widget.classList.add(
          'inline-block',
          'px-2',
          'mx-1',
          'align-middle',
          'bg-indigo-600',
          'hover:bg-indigo-700',
          'shadow',
          'rounded',
          'text-white',
          'cursor-pointer'
        )
        widget.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
          <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>`
        return widget
      },
    },
  },
})

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  render: h => h(App),
})
