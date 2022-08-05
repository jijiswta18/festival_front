import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'


Vue.use(VueAxios,axios)

axios.defaults.baseURL = 'http://localhost:5000'; //'http://10.100.90.23';

axios.defaults.headers.common = {
  // "Content-Type": "application/json",
  // 'X-Requested-With': 'XMLHttpRequest',
};



// Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
