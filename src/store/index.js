import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lastState: {
      clearedAt: null,
      activeView: 'ALL',
      variablesOpened: false,
    },
    settings: {
      colorMode: 'Auto',
      colorTheme: 'dark',
      sortOption: 'newest',
    },
    typeColors: {
      GQL: 'pink-500', // bg-pink-500 text-pink-500
      GET: 'blue-500', // bg-blue-500 text-blue-500
      POST: 'purple-500', // bg-purple-500 text-purple-500
      PUT: 'purple-500', // bg-purple-500 text-purple-500
      PATCH: 'purple-500', // bg-purple-500 text-purple-500
      DELETE: 'rose-500', // bg-rose-500 text-rose-500
    },
  },
  mutations: {
    setSettings(state, settings) {
      state.settings = {
        ...state.settings,
        ...settings,
      }

      if (settings.colorMode)
        state.settings.colorTheme =
          settings.colorMode === 'Auto'
            ? browser.devtools.panels.themeName === 'dark'
              ? 'dark'
              : 'light'
            : settings.colorMode.toLowerCase()
    },
    setLastState(state, lastState) {
      state.lastState = {
        ...state.lastState,
        ...lastState,
      }
    },
  },
  plugins: [
    createPersistedState({
      paths: ['lastState', 'settings'],
    }),
  ],
})
