<template>
  <v-app id="inspire">
    <v-navigation-drawer
      class="sidebar"
      v-model="drawer"
      app
    >
      <v-list-item >
        <v-list-item-content class="head-menu">
          <div class="logo-cgd mr-2">
            <img src="@/assets/images/logo-cgd.png"/>
          </div>
          <v-list-item-title class="text-h6">
            ลงนามถวายพระพร
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list 
      class="mt-5"
        dense 
        nav
      >
        <router-link  
          v-if="check_roles.roles === 'admin'"
          class="d-flex align-center menu-link"
          to="/"
        >
          <v-list-item link>
              <i class="fa-solid fa-list menu-icon"></i>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
               รายการเทศกาล
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link
          v-if="check_roles.roles === 'admin'"
          class="d-flex align-center menu-link"
          to="/user"
        >
          <v-list-item link>
              <i class="fa-solid fa-users menu-icon"></i>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
              รายการบุคลากร
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        
        <router-link 
          class="d-flex align-center menu-link"
          to="/report"
        >
          <v-list-item link>
              <i class="fa-solid fa-file-export menu-icon"></i>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
              รายงาน
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="navbar" app>
      <div class="style-navbar">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <div class="align-center d-flex">
          <span class="mr-2">{{check_roles.name}}</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <div 
                class="box-user mr-2"
                v-bind="attrs"
                v-on="on"
              >
               <i class="fa-solid fa-circle-user"></i>
              </div>
            </template>
            
            <v-list>
              <v-list-item @click="logout">
                <v-list-item-title>ออกจากระบบ</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- <div  :class="!check_festival?'isdisabled':''"> -->
            <router-link to="/festival">
                <i class="fa-solid fa-arrow-up-right-from-square f-24"></i>
            </router-link>
          <!-- </div>  -->
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <v-container class="mt-3">
         <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import store from '../store/index.js';
    import moment from 'moment';
  export default {
    name: 'MyHome',
    components: {},
    data: () => ({
      drawer: null,
      right: null,
      check_roles: store.getters.user,
    }),
     computed: {
        check_festival () {
          
          let data_festival = this.$store.getters.festival

          let date_today = moment().format('DD/MM/YYYY hh:mm')
     
          let start_date = moment(data_festival.start_date).format('DD/MM/YYYY hh:mm')

          let end_date = moment(data_festival.end_date).format('DD/MM/YYYY hh:mm')
          
          let check_date = (date_today >= start_date) && (date_today <= end_date)

          return check_date

        
        },
    },

    methods: {
      async logout(){
        await this.$store.dispatch('logout')
        this.$router.push('/login')
      },
    }
  }
</script>
<style>
  body{
    font-family: 'Prompt', sans-serif !important;
  }
  .style-navbar{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .box-logout{
    cursor: pointer;
  }
  .btn-submit{
      background-color: #0170c2;
      border: 1px solid #0170c2;
      color: white!important;
  }
  .btn-cancel{
      color: #0170c2!important;
      border: 1px solid #0170c2;
      margin-right: 0.5rem;
  }

  .sidebar{
    background-color: #181824!important;
  }
  .navbar{
    background-color: white!important;
  }

  .text-h6{
    color: white;
  }
  .menu-link{
    text-decoration: none;
  }
  .menu-icon {
    width: 20px;
    margin-right: 1rem;
    color: #a2a3b7!important;
    font-size: 18px;
  }
  .menu-text{
    color: #a2a3b7;
    font-size: 14px!important;
  }
  .box-user .fa-circle-user{
    font-size: 24px!important;
  }
  .f-24{
    font-size: 22px;
  }
  .isdisabled a{
    pointer-events: none;
    cursor: none;
  }
  .logo-cgd{
    max-width: 48px;
    height: 48px;
  }
  .logo-cgd img{
    width: 100%;
  }
  .head-menu{
    flex-wrap: inherit!important;
    width: 100%;
  }
  .v-main{
    background-color: #eef0f8;
  }

  /* sidebar active */
  .menu-link.router-link-exact-active{
    background-color: #3445E5;
  }
  .menu-link.router-link-exact-active:hover{
    background-color: #3445E5;
  }
  .menu-link.router-link-exact-active .menu-icon,
  .menu-link.router-link-exact-active .menu-text{
    color: white!important;
  }
  .menu-link:hover{
    background-color: #27283D;
  }
  .menu-link:hover .menu-icon,
  .menu-link:hover .menu-text{
    color: white!important;
  }
</style>
