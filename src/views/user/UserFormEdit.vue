<template>
    <div>
        <v-card class="mx-auto">
            <v-toolbar flat class="d-flex justify-space-between">
                <v-toolbar-title>แก้ไขข้อมูลผู้ใช้งาน</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
                <v-card-text >
                    <v-row align="center">
                        <v-col
                            cols="12"
                            sm="12"
                        >
                            <v-text-field
                                v-model="username"
                                :rules="usernameRules"
                                label="ชื่อผู้ใช้งาน"
                                dense
                                outlined
                                clearable
                                disabled

                            ></v-text-field>
                        </v-col>
        
                        <!-- <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-text-field
                                dense
                                outlined
                                clearable
                                v-model="password"
                                label="รหัสผ่าน"
                                :rules="passwordRules"
                                :type="show1 ? 'text' : 'password'"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="show1 = !show1"
                            ></v-text-field>
                        </v-col> -->
                    </v-row>

                    <v-row align="center">
                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-text-field
                                v-model="name"
                                :rules="nameRules"
                                label="ชื่อ"
                                dense
                                outlined
                                clearable
                                thai_engLanguage
                                maxlength="30"
                            ></v-text-field>
                        </v-col>

                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-text-field
                                v-model="lastname"
                                :rules="lastnameRules"
                                label="นามสกุล"
                                dense
                                outlined
                                clearable
                                thai_engLanguage
                                maxlength="30"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                     <v-row align="center">
                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-text-field
                                v-model="position"
                                :rules="positionRules"
                                label="ตำเเหน่ง"
                                dense
                                outlined
                                clearable
                                thai_engLanguage
                            ></v-text-field>
                        </v-col>

                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-select
                                v-model="divisions"
                                :items="selectDivisions"
                                :rules="rules.divisionsRules"
                                item-text="value"
                                item-value="id"
                                label="หน่วยงาน"
                                dense
                                outlined
                            ></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-select
                            v-model="roles"
                            :items="selectRoles"
                            :rules="rules.rolesRules"
                            item-text="value"
                            item-value="id"
                            label="ประเภทสิทธิ์การใช้งาน"
                            dense
                            outlined
                            ></v-select>
                        </v-col>

                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-select
                            v-model="state"
                            :items="selectState"
                            :rules="rules.stateRules"
                            item-text="value"
                            item-value="id"
                            label="สถานะการใช้งาน"
                            dense
                            outlined
                            ></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col
                            cols="12"
                            sm="6"
                        >
                        <v-textarea
                            outlined
                             dense
                            name="input-7-4"
                            label="หมายเหตุ"
                            v-model="detail"
                            ></v-textarea>
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-toolbar flat class="box-button">
                    <v-btn
                        class="btn btn-submit mr-2"
                        text
                        @click="updateUser"
                    >
                        บันทึก
                    </v-btn>
                        <v-btn color="error mr-2" @click="deleteUser"><i class="fa-solid fa-trash-can mr-1"></i>ลบ</v-btn>
                    <v-btn
                        class="btn btn-cancel"
                        text
                        @click="cancel"
                    >
                        ยกเลิก
                    </v-btn>
                
                </v-toolbar>

            </v-form>
        </v-card>
    </div> 
</template>
<script>
    import  axios  from "axios";
    import Swal from 'sweetalert2'
    import store from '../../store/index.js';
    export default {
        props: ['item'],
        data: () => ({
            show1: false,
            valid: true,
            username: '',
            password: '',
            name: '',
            lastname: '',
            position: '',
            detail: '',
            userId: store.getters.user.id,
            roles: { value: '', id: null },
            selectRoles: [
                { value: 'ผู้ดูเเลระบบ', id: 'admin' },
                { value: 'ผู้ใช้งานระดับสูง', id: 'vip' },
            ],
            divisions: { value: '', id: null },
            selectDivisions: [
                { value: 'ศทส', id: 1 },
                { value: 'สล', id: 2 },
            ],
            state: { value: '', id: null },
            selectState: [
                { value: 'ใช้งาน', id: 1 },
                { value: 'ไม่ใช้งาน', id: 0 },
            ],
            usernameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
            ],
            passwordRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v => v.length >= 8 || 'Min 8 characters',
            ],
            nameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
            ],
            lastnameRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
            ],
            positionRules: [
                v => !!v || 'กรุณากรอกข้อมูล',
                v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
            ],
            rules:{
                // divisionsRules: [(v) =>  v.length > 0 || "เลือกประเภทหน่วยงาน"],
                rolesRules: [(v) =>  v.length > 0 || "เลือกประเภทสิทธิ์การใช้งาน"],
                // stateRules: [(v) =>  v.length > 0 || "เลือกประเภทสิทธิ์การใช้งาน"],
            },
            data: {}   
        }),
        created(){
            this.getUserDetail()
        },
        methods: {
            async getUserDetail(){
                let path = await `/api/getUserDetail`
                let response = await axios.get(`${path}/`+this.$route.params.id)
                console.log(response);
                this.data = response.data.data[0]
                  this.username     = this.data.username
                //   this.password     = this.data.password
                  this.name         = this.data.name
                  this.lastname     = this.data.lastname
                  this.position     = this.data.position
                  this.divisions    = this.data.divisions
                  this.roles        = this.data.roles
                  this.state        = this.data.state
                  this.detail       = this.data.detail
            },
            async updateUser(){ 
                if(this.$refs.form.validate()){
                    let fd = {
                        "id"        : this.$route.params.id,
                        "userId"    : this.userId,
                        // "username"  : this.username,
                        // "password"  : this.password,
                        "name"      : this.name,
                        "lastname"  : this.lastname,
                        "position"  : this.position,
                        "divisions" : this.divisions,
                        "roles"     : this.roles,
                        "state"     : this.state,
                        "detail"    : this.detail
                    }
                    try {

                        let path = await `/api/updateUser`
                        let response = await axios.post(`${path}`, fd)
                        console.log(response);
                        Swal.fire({
                            icon: 'success',
                            title: 'บันทึกสำเร็จ',
                            text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                        }).then( function(){
                            window.location.href = '/user';
                        });
                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'บันทึกไม่สำเร็จ',
                            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
                        })
                        console.log('error :' + error)
                    }
                }
            },
            cancel(){
                 this.$router.push('/user')
            },
            async deleteUser (v) {
                console.log(v);
                Swal.fire({
                    title: 'คำเตือน',
                    text: "คุณต้องการลบข้อมูลเจ้าหน้าที่ใช่หรือไม่ ?",
                    icon: 'warning',
                    showCancelButton: true,
                    // confirmButtonColor: '#3085d6',
                    // cancelButtonColor: '#d33',
                    confirmButtonText: 'ลบ',
                    cancelButtonText: 'ยกเลิก',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const payload = { 
                            id: v.id,
                            userId: this.userId
                        }
                        let path =  `/api/deleteUser`
                        let response = await axios.post(`${path}`, payload)

                        if(payload){
                            Swal.fire({
                                icon: 'success',
                                // title: 'เรียบร้อย',
                                text: 'ลบข้อมูลพนักงานสำเร็จ',
                            })
                            if(response){
                                window.location.href = '/user';
                            }
                        }else{
                            Swal.fire({
                                icon: 'error',
                                title: 'บันทึกไม่สำเร็จ',
                                text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
                            })
                        }
                          
                    }
                }) 
            },

        }
    }

</script>
<style>
    .box-button .v-toolbar__content{
        justify-content: center;
    }
</style>
