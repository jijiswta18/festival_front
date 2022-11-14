import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js';

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import FestivalView from '../views/festival/FestivalViewNew.vue'
import FestivalPreview from '../views/festival/FestivalPreviewNew.vue'
import FestivalForm from '../views/FestivalForm.vue'
import ReferenceView from '../views/reference/ReferenceView.vue'
import TestView from '../views/testView.vue'
import UserView from '../views/user/UserView.vue'
import UserForm from '../views/user/UserForm.vue'
import UserFormEdit from '../views/user/UserFormEdit.vue'
import ReportView from '../views/report/ReportView.vue'
import ReportSign from '../views/report/ReportSign.vue'



Vue.use(VueRouter)


const routes = [

  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter (to, from, next) {
      store.dispatch('checkLogin')
      if (store.state.user) {         

        next({ name: 'festival' })
      } else {

          next()
      }
    },
  },

  {
    path: '/festival/test',
    name: 'test_festival',
    component: TestView,
    // beforeEnter (to, from, next) {
    //   store.dispatch('checkLogin')
    //   if (store.state.user) {          
    //       next()          
    //   } else {
    //       next('/login')
    //   }
    // },
  },

  {
    path: '/festival',
    name: 'festivalForm',
    component: FestivalForm,
  },

  {
    path: '/festival/preview/:id',
    name: 'festivalPreview',
    component: FestivalPreview,
    beforeEnter (to, from, next) {
      store.dispatch('checkLogin')
      if (store.state.user) {          
          next()          
      } else {
          next('/login')
      }
    },
  },

  {
    path: '/',
    component: HomeView,
    beforeEnter (to, from, next) {
      store.dispatch('checkLogin')
      if (store.state.user) {          
          next()          
      } else {
          next('/login')
      }
    },

    children: [
      {
        path: '',
        name: 'festival',
        component: FestivalView
      },
      {
        path: '/reference',
        name: 'reference',
        component: ReferenceView
      },

      {
        path: '/user',
        name: 'user',
        component: UserView
      },
      {
        path: '/user/form',
        name: 'userForm',
        component: UserForm
      },
      {
        path: '/user/form/:id',
        name: 'userFormEdit',
        component: UserFormEdit
      },
      {
        path: '/report',
        name: 'report',
        component: ReportView
      },
      {
        path: '/report/sign/:id',
        name: 'reportSign',
        component: ReportSign
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
