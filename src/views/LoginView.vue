<template>
    <div class="box-login">
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4 m-auto>
                    <v-card class="elevation-12">
                        <v-toolbar class="header-form">
                        <v-toolbar-title class="title-form">Login</v-toolbar-title>
                        </v-toolbar>
                        <v-form    
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                            <v-card-text>
                                <v-text-field
                                    v-model="username"
                                    :rules="usernameRules"
                                    label="username"
                                ></v-text-field>
                                <v-text-field
                                    v-model="password"
                                    :rules="passwordRules"
                                    label="Password"
                                    :type="show1 ? 'text' : 'password'"
                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="show1 = !show1"
                                ></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn class="btn-login" @click="login">Login</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
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
            valid: true,
            show1: false,
            username: '',
            usernameRules: [
                v => !!v || 'username is required',
            ],
            password: '',
            passwordRules: [
                v => !!v || 'password is required',
                v => v.length >= 8 || 'Min 8 characters',
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
                        await this.$store.dispatch('login', {
                            username : this.username,
                            password : this.password
                        })

                        if (this.$store.getters.user){
                            this.$router.push({name:"festival"});

                            Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'เข้าสู่ระบบสำเร็จ',
                            showConfirmButton: false,
                            timer: 1500
                    })
                            
                        }
                    } catch (error) {
                        console.log(error);
                    }
                   
                }

            }
        },
    };
</script>
<style>
    .box-login{
        height: 100%;
    }
    .header-form{
        background-color: #213862!important;
    }
    .title-form{
        color: white;
    }
    .btn-login{
        background-color: #213862!important;
        color: white!important;

    }
</style>