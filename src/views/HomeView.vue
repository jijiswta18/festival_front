<template>
  <v-app id="inspire">
    <v-navigation-drawer
      class="sidebar"
      v-model="drawer"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Festival
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
            <router-link to="/festival/form">
                <i class="fa-solid fa-arrow-up-right-from-square f-24"></i>
            </router-link>
          
        </div>



        <!-- <div class="box-logout" @click="logout" >
          <i class="fa-solid fa-right-from-bracket"></i>
        </div> -->
      </div>
    
    
    </v-app-bar>
    <v-main>
       
      <v-container>
         <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>


</template>

<script>
  import store from '../store/index.js';
  export default {
    name: 'MyHome',
    components: {},
    data: () => ({
      drawer: null,
      right: null,
      check_roles: store.getters.user
      //
    }),
    methods: {
      async logout(){
        await this.$store.dispatch('logout')
        this.$router.push('/login')
      }
    }
  }
</script>
<style>
  /* body{
    font-family: 'Prompt', sans-serif;
  } */
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
    background-color: #1e1e2d!important;
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
  }
  .menu-text{
    color: #a2a3b7;
  }
  .box-user .fa-circle-user{
    font-size: 24px!important;
  }
  .f-24{
    font-size: 22px;
  }
</style>
