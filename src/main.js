import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import VueExcelXlsx from "vue-excel-xlsx";


Vue.use(VueAxios,axios)

Vue.use(VueExcelXlsx);



axios.defaults.baseURL = 'http://localhost:5000'; //'http://10.100.90.23';

axios.defaults.headers.common = {
  "Content-Type": "application/json",
  'X-Requested-With': 'XMLHttpRequest',
};

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization =  token ? `Bearer ${token}` : '';
  return config;
});

// let token = JSON.parse( localStorage.getItem('token') );

// Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
