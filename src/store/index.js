import Vue from 'vue'
import axios from 'axios';
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'


Vue.use(Vuex)
const getDefaultState = () => {
  return {
    user: null,
    festival: null,
  }
}
export default new Vuex.Store({
  plugins: [new VuexPersistence().plugin],

  state: getDefaultState(),

  getters: {
    user (state) {
      return state.user
    },
    festival (state) {
      return state.festival
    },
    isAuthenticated: state => !!state.user,  

   
  },
  mutations: {
    authUser (state, data) {
      state.user = data
    },
    checkFestival (state, data) {
      state.festival = data
    },
    metaData (state, data) {
      state.festival = data
    },
    clearAuthData (state) {
      state.user = null
      // state.festival = null
      localStorage.removeItem('token')
      localStorage.removeItem('expirationDate')
    },


  },
  actions: {

    async login ( {commit}, authData){


      let path = '/api/login'
      // let path = '/api/login'
      let response =  await axios.post(path,{
          username: authData.username,
          password: authData.password
      })

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
      }

      expirationDate = new Date(now.getTime() + 1*60*60*1000)
      localStorage.setItem('expirationDate', expirationDate)

    },

    async checkFestival({ commit }){
      let path = '/api/checkFestival'
      let response =  await axios.get(path)

      console.log('============',response);

      const checkData = response.data.data[0]
      await commit('checkFestival', checkData)
      await commit('metaData', checkData)

    },

    async logout({commit}){
      commit('clearAuthData')
    }
   


  },
  modules: {
  }
})
