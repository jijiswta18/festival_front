import Vue from 'vue'
import axios from 'axios';
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'


Vue.use(Vuex)
const getDefaultState = () => {
  return {
    user: null,
  }
}
export default new Vuex.Store({
  plugins: [new VuexPersistence().plugin],

  state: getDefaultState(),

  getters: {
    user (state) {
      return state.user
    },
    isAuthenticated: state => !!state.user,  

   
  },
  mutations: {
    authUser (state, data) {
      state.user = data
    },
    clearAuthData (state) {
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('expirationDate')
    },


  },
  actions: {

    async login ( {commit}, authData){
      let path = '/api/login'
      let response =  await axios.post(path,{
          username: authData.username,
          password: authData.password
      })

      console.log(response);

      const now = await new Date()
      
      const expirationDate = await new Date(now.getTime() + 1*60*60*1000)

      const userData = response.data

      await commit('authUser', userData.userdata)

      await localStorage.setItem('token', userData.token)

      await localStorage.setItem('expirationDate', expirationDate)  

    },

    checkLogin({ commit }){

      let now = new Date()

      let expirationDate = new Date(localStorage.getItem('expirationDate'))

      if (now >= expirationDate){
          console.log('expire','now')
          commit('clearAuthData')
          return
      }else{
        console.log('expire','expire')
      }

      expirationDate = new Date(now.getTime() + 1*60*60*1000)
      localStorage.setItem('expirationDate', expirationDate)

    },


    async logout({commit}){
      commit('clearAuthData')
    }
    // async logout({ commit }){
    //   let path = await '/api/logout'      
    //   await axios.post(path)
    //   await commit('clearAuthData')    
    // },

  },
  modules: {
  }
})
