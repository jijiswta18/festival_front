import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import VueExcelXlsx from "vue-excel-xlsx"
import VueMeta from 'vue-meta'
import VueAnalytics from 'vue-analytics';


// router.beforeEach ((to, from, next) => {
//   window.document.title = to.meta.title;
//     next() 
// })

Vue.use(VueAxios,axios)

Vue.use(VueExcelXlsx);

Vue.use(VueMeta)

Vue.use(VueAnalytics, {
  id: 'UA-247452077-1',
  router
});



axios.defaults.baseURL = ''; //'http://10.100.90.23';
// axios.defaults.baseURL = 'http://localhost:5000'; //'http://10.100.90.23';

axios.defaults.headers.common = {
  "Content-Type": "application/json",
  'X-Requested-With': 'XMLHttpRequest',
};

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if(token){
    config.headers['Authorization'] = `Bearer ${token}`;
  }
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
