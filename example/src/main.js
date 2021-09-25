import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false

new Vue({
  apolloProvider: createProvider(),
  render: function (h) { return h(App) }
}).$mount('#app')
