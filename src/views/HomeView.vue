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
          v-if="check_roles.roles === 'admin' || check_roles.roles === 'general'"
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
          v-if="check_roles.roles === 'admin' || check_roles.roles === 'general'"
          class="d-flex align-center menu-link"
          active-class="activemenu"
          to="/reference"
        >
          <v-list-item link>
            <i class="fa-solid fa-list-check menu-icon"></i>
            <!-- <i class="fa-solid fa-list menu-icon"></i> -->
            <v-list-item-content>
              <v-list-item-title class="menu-text">
              รายการคำอวยพร
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link
          v-if="check_roles.roles === 'admin'"
          class="d-flex align-center menu-link"
          active-class="activemenu"
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
          active-class="activemenu"
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
          <span class="mr-2 color-primary">{{check_roles.name}} {{ check_roles.lastname }}</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <div 
                class="box-user mr-2"
                v-bind="attrs"
                v-on="on"
              >
               <i class="fa-solid fa-circle-user f-24"></i>
              </div>
            </template>
            
            <v-list>
              <v-list-item @click="logout">
                <v-list-item-title>ออกจากระบบ</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- <div  :class="!check_festival?'isdisabled':''"> -->
          <div
            v-if="this.$store.getters.festival"
            class="color-primary"
            @click="previewItem"

            >
            <i class="fa-solid fa-arrow-up-right-from-square f-24"></i>
          </div>

          <!-- <router-link :to="{ name: 'festivalForm'}" target="_blank">
            <i class="fa-solid fa-arrow-up-right-from-square f-24"></i>
          </router-link> -->
            <!-- <router-link to="/festival">
                <i class="fa-solid fa-arrow-up-right-from-square f-24"></i>
            </router-link> -->
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
      previewItem(){
        const routeData = this.$router.resolve({
          name: "festivalForm",
        });
        window.open(routeData.href, "_blank");
    },
      async logout(){
        await this.$store.dispatch('logout')
        this.$router.push('/login')
      },
    }
  }
</script>
<style>
  .v-application{
    font-family: 'Prompt', sans-serif !important;
  }
  table,
  .style-front{
    font-family: "Roboto", sans-serif;
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
  .f-24{
    font-size: 24px;
    cursor: pointer;
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

  .color-primary{
    color: #213862;
  }

  .activemenu,
  .router-link-exact-active{
    background-color: #3445E5;
  }
  .activemenu:hover,
  .router-link-exact-active:hover{
    background-color: #3445E5;
  }
  .activemenu .menu-icon,
  .activemenu .menu-text{
    color: white!important;
  }
  .activemenu.menu-link:hover{
    background-color: #3445E5;
  }
  .router-link-exact-active .menu-icon,
  .router-link-exact-active .menu-text{
    color: white!important;
  }
  .router-link-exact-active.menu-link:hover{
    background-color: #3445E5;
  }
  .menu-link:hover{
    background-color: #27283D;
  }
  .menu-link:hover .menu-icon,
  .menu-link:hover .menu-text{
    color: white!important;
  }
  @media only screen and (max-width: 767px) {
        .table-head{
           height: auto!important;
        }
        .table-head .v-toolbar__title{
          margin-bottom: 0.5rem;
        }
        .table-head .v-toolbar__content{
           display: inline-block!important;
           height: auto!important;
           width: 100%;
           padding: 20px 16px;
        }
        .table-head button{
            min-width: 100%!important;
        }
        .table-head .mb{
          margin-bottom: 0.5rem;
          min-height: 45px;
        }
        .v-data-table-header-mobile__wrapper{
          display: none!important;
        }
    }
</style>
