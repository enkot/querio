import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'
import 'codemirror-graphql/mode'

import App from './App.vue'
import './assets/tailwind.css'
import 'codemirror/lib/codemirror.css'

Vue.config.productionTip = false

Vue.use(VueCodemirror)

new Vue({
  render: h => h(App),
}).$mount('#app')
