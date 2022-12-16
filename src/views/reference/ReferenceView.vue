<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="datas"
            :search="search"
            :loading="loadTable"
            sort-by="calories"
            loading-text="Loading..."
            class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar flat class="table-head">
                    <v-toolbar-title class="mr-2">รายการคำอวยพร</v-toolbar-title>
                    <v-btn
                        class="btn-create mb"
                        @click="create"
                        >
                        <i class="fa-solid fa-plus icon-style"></i>
                        เพิ่มรายการใหม่
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="ค้นหา (คำอวยพร)"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-toolbar>
            </template>
            <template v-slot:[`item.create_date`]="{ item }">{{getThaiDate(item.create_date)}}</template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                    color="primary"
                    fab
                    x-small
                    dark
                   
                    @click="editItem(item)"
                    >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <v-row justify="center">
            <v-dialog
                v-model="dialog"
                persistent
                max-width="700px"
                >
                <v-card>
                    <v-card-title class="title-festival">
                        <span class="text-h5">{{formTitle}}</span>
                    </v-card-title>
            
                    <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                        enctype="multipart/form-data"
                    >
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            label="คำอวยพร"
                                            v-model="item_datas.name"
                                            solo
                                            clearable
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">

                                        <v-select
                                            v-model="item_datas.festival"
                                            :items="selectFestival"
                                            item-text="value"
                                            item-value="id"
                                            item-disabled="disable"
                                            chips
                                            label="เลือกรายการเทศกาล"
                                            multiple
                                            clearable
                                        >
                                    </v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                class="btn btn-submit"
                                text
                                @click="submit"
                            >
                            บันทึก
                            </v-btn>
                           
                            <v-btn
                                class="btn btn-cancel"
                                text
                                @click="close"
                            >
                                ยกเลิก
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>

            <v-dialog
                v-model="dialog_detail"
                persistent
                max-width="700px"
                >
                <v-card>
                    <v-card-title class="title-festival">
                        <span class="text-h5">เทศกาลที่ใช้คำอวยพร</span>
                    </v-card-title>
                    aaaa
                </v-card>
            </v-dialog>


       
        </v-row>
    </div>
  </template>
  <script>
    import  axios  from "axios";
    import Swal from 'sweetalert2';
    import store from '../../store/index.js';
    export default {
        data: () => ({
        userId: store.getters.user.id,
        search: "",
        loadTable: true,
        dialog: false,
        dialog_detail: false,
        valid: true,
        editedIndex: -1,
        item_datas : {},
        datas: [],
        selectFestival: [],
        headers: [
            { text: "วันที่จัดทำ", value: "create_date", width: "10%" },
            { text: "คำอวยพร", value: "name" },
            { text: "Actions", value: "actions", align: "center",  width: "20%", sortable: false },
        ],
        nameRules: [
                v => !!v || 'กรุณาใส่ข้อมูล',
                v => ( v && v.length <= 255 ) || "ห้ามใส่ข้อมูลเกิน 255 ตัวอักษร",
            ],
        }),
        mounted() {
            this.getReference();
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'สร้างคำอวยพร' : 'แก้ไขคำอวยพร'
            },
         },
        methods: {
            getThaiDate(item) {
                if (item) {
                    var d = new Date(item);
                    return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
                }
                else {
                    return "";
                }
            },
            close(){
                this.dialog = false
                this.$refs.form.resetValidation()
                this.$refs.form.reset()
                this.getFestival();
            },
            async create(){
                this.dialog         = await true
                this.editedIndex    = await -1   
                await this.getFestival();
            },
            async editItem(v){
                this.dialog = await true
                this.editedIndex = await this.datas.indexOf(v)
                this.item_datas = await JSON.parse(JSON.stringify(v))
                let id_festival = await v.tag_festival.replace(/['"]+/g, '');
                this.item_datas.festival = await JSON.parse(id_festival);
                await this.getFestival();
            },
            async getFestival(){

                let path = await `/api/get/Festival`;

                let response = await axios.get(`${path}`);

                response.data.data.forEach(item => {

                    this.selectFestival.push({'id':item.id, 'value':item.name})

                })

            },
            async getReference(){

                try {
                    let path        = await `/api/get/reference`;
                    let response    = await axios.get(`${path}`);
                    this.datas      = await response.data.data;
                    this.loadTable  = await false;
        
                } catch (error) {
                    console.log(error);
                }

            },
            async submit(){

                if(this.$refs.form.validate()){

                    try {

                        if (this.editedIndex > -1) {
                            
                            let str = this.item_datas.festival.map(String)

                            let fd_edit = await {
                                "user_id"       : this.userId,
                                "id"            : this.item_datas.id,
                                "name"          : this.item_datas.name,
                                "tag_festival"  : JSON.stringify(str),
                            }



                            let path_edit   = await `api/edit/reference`
                            let res_edit    = await axios.post(`${path_edit}`, fd_edit)
                                                 
                            console.log(res_edit);

                        } else {

                            let str = this.item_datas.festival.map(String)

                            let fd = await {
                                "user_id"       : this.userId,
                                "name"          : this.item_datas.name,
                                "tag_festival"  : JSON.stringify(str),
                            }

                            let path        = await `api/create/reference`
                            let res         = await axios.post(`${path}`, fd)
                            
                            console.log(res);
                        }

                        Swal.fire({
                            icon: 'success',
                            title: 'บันทึกสำเร็จ',
                            text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว' 
                        }).then( function(){
                        });
                        this.dialog = await false
                        this.item_datas = await {},
                        await this.getReference()
                     
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
        },
    }
</script>