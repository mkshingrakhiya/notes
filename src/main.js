import Vue from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library as FontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core'
import { faLightbulb, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faGripLines, faHeart, faPlus } from '@fortawesome/free-solid-svg-icons'

import './assets/css/tailwind.css'

import App from './App.vue'

FontAwesomeLibrary.add(faGripLines, faHeart, faLightbulb, faPlus, faTrashAlt)
Vue.component('fa-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
