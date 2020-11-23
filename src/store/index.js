import Vue from 'vue'
import Vuex from 'vuex'
import Lockr from 'lockr'

Vue.use(Vuex)

Lockr.prefix = 'querio_'

export default new Vuex.Store({
  state: {
    settings: Lockr.get('settings') || {
      colorMode: 'Auto',
      colorTheme: 'dark',
    },
    typeColors: {
      GQL: 'pink-500',
      GET: 'blue-500',
      POST: 'purple-500',
      PUT: 'purple-500',
      PATCH: 'purple-500',
      DELETE: 'red-500',
    },
  },
  mutations: {
    setSettings(state, settings) {
      state.settings = {
        ...settings,
        colorMode: settings.colorMode,
        colorTheme:
          settings.colorMode === 'Auto'
            ? browser.devtools.panels.themeName === 'dark'
              ? 'dark'
              : 'light'
            : settings.colorMode.toLowerCase(),
      }
      Lockr.set('settings', state.settings)
    },
  },
  actions: {},
  modules: {},
})
