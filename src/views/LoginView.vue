<template>
    <div class="box-login">
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md3 m-auto>
                    <!-- <v-card class="elevation-12 login-center px-2 py-2"> -->
                    <div class="login-center px-7 py-7">
                        <div class="box-header">
                            <div class="header-form mr-2">
                                <img src="@/assets/images/logo-cgd.png"/>
                            </div>
                         
                        <!-- <v-toolbar-title class="title-form">Login</v-toolbar-title> -->
                        </div>
                        <div class="text-head text-center mt-7">
                              <h2>ระบบลงนามถวายพระพร</h2>
                              <h2>กรมบัญชีกลาง</h2>
                        </div>
                         
                        <v-form    
                            ref="form"
                            v-model="valid"
                            lazy-validation 
                            class="mt-9"
                            @submit.prevent="login"
                        >
                            <div class="card-text">                              
                                <v-text-field
                                    v-model="username"
                                    :rules="usernameRules"
                                    dense
                                    outlined
                                    clearable
                                    label="username"
                                    class="input-username"
                                    prepend-icon="fa-solid fa-user"
                                ></v-text-field>
                               <!-- <font-awesome-icon icon="fa-solid fa-lock" /> -->
                                <v-text-field
                                    v-model="password"
                                    :rules="passwordRules"
                                    dense
                                    outlined
                                    clearable
                                    label="Password"
                                    :type="show1 ? 'text' : 'password'"
                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="show1 = !show1"
                                    prepend-icon="fa-solid fa-lock"
                                    class="input-password"
                                    autocomplete="on"
                                ></v-text-field>
                                
                            </div>
                            <div class="text-center mt-2">
                                <!-- <v-spacer></v-spacer> -->
                                <v-btn 
                                    class="btn-login text-center" 
                                    type="submit"
                                    :disabled="disabled == true"
                                    
                                    
                                
                                >Login</v-btn>
                            </div>
                        </v-form>
                    </div>
                    <!-- </v-card> -->
               </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
    // import  axios  from "axios";
    import Swal from 'sweetalert2'
    export default {
        name: 'LoginView',
        data: () => ({
            disabled: false,
            valid: true,
            show1: false,
            username: '',
            usernameRules: [
                v => !!v || 'กรุณาใส่ข้อมูล',
            ],
            password: '',
            passwordRules: [
                v => !!v || 'กรุณาใส่ข้อมูล',
                v => (v && v.length >= 8) || 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            ],
            passwordFieldType: "password"

        }),
        computed: {
            count () {
                return this.$store.getters.getCount
            },
        },
        methods:{
            async login(){
                if(this.$refs.form.validate()){
                    try {
                        this.disabled =  await true
                        await this.$store.dispatch('login', {
                            username : this.username,
                            password : this.password
                        })

                        if (this.$store.getters.user){

                            if(this.$store.getters.user.roles === 'admin' || this.$store.getters.user.roles === 'general'){
                                this.$router.push({name:"festival"});
                            }else{
                                this.$router.push({name:"report"});
                            }
                           
                            Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'เข้าสู่ระบบสำเร็จ',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.$store.dispatch('checkFestival')    
                    }
                    } catch (error) {
                        Swal.fire({
                            title: 'Error!',
                            text: 'รหัสผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        })

                        this.disabled =  await false

                        // Swal.fire({
                        //     title: 'Submit your Github username',
                        //     input: 'text',
                        //     inputAttributes: {
                        //         autocapitalize: 'off'
                        //     },
                        //     showCancelButton: true,
                        //     confirmButtonText: 'Look up',
                        //     showLoaderOnConfirm: true,
                        //     preConfirm: (login) => {
                        //         return fetch(`//api.github.com/users/${login}`)
                        //         .then(response => {
                        //             if (!response.ok) {
                        //             throw new Error(response.statusText)
                        //             }
                        //             return response.json()
                        //         })
                        //         .catch(error => {
                        //             Swal.showValidationMessage(
                        //             `Request failed: ${error}`
                        //             )
                        //         })
                        //     },
                        //     allowOutsideClick: () => !Swal.isLoading()
                        //     }).then((result) => {
                        //     if (result.isConfirmed) {
                        //         Swal.fire({
                        //         title: `${result.value.login}'s avatar`,
                        //         imageUrl: result.value.avatar_url
                        //         })
                        //     }
                        //     })
                        console.log(error, '');
                    }
                   
                }

            }
            
        },
    };
</script>
<style>
    .box-login{
        height: 100%;
        background-color: #243678;
        /* background-color: #e8ecf8; */
    }
    .login-center{
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)!important;

        /* background-color: #181824!important; */
    }
    .text-head{
        color: #36405a;
    }
    .box-header{
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
    }
    .header-form{
        height: 90px;
        width: 90px;
    }
    .header-form img{
       width: 100%;
    }
    .btn-login{
        background-color: #213862!important;
        color: white!important;
        width: 100%;
        max-width: 50%;
    }
    .login-center  .fa-user,
    .login-center  .fa-lock{
        font-size: 18px;
    }
</style>