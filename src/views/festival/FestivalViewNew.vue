<template>
    <div>
        <v-data-table
        :headers="headers"
        :items="check_datas"
        :search="search"
        sort-by="calories"
        class="elevation-1"
    >
            <template v-slot:top>
                <v-toolbar flat class="table-head">
                    <v-toolbar-title class="mr-2">รายการเทศกาล</v-toolbar-title>
                    <v-btn
                        class="btn-create mb"
                        @click="create"
                        >
                        <i class="fa-solid fa-plus icon-style"></i>
                        เพิ่มรายการใหม่
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-checkbox
                        v-model="checkbox"
                        :label="`เเสดงรายการทั้งหมด`"
                        @click="checkState()"
                    ></v-checkbox>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-toolbar>
            </template>
            <!-- <template v-slot:[`item.number`]="{index}">{{index + 1}}</template> -->
            <template v-slot:[`item.create_date`]="{ item }">{{getThaiDate(item.create_date)}}</template>
            <template v-slot:[`item.start_date`]="{ item }">{{getThaiDate(item.start_date)}}</template>
            <template v-slot:[`item.end_date`]="{ item }">{{getThaiDate(item.end_date)}}</template>
            <template v-slot:[`item.start_time`]="{ item }">{{timeFormat(item.start_date)}}</template>
            <template v-slot:[`item.end_time`]="{ item }">{{timeFormat(item.end_date)}}</template>
            <template v-slot:[`item.status`]="{ item }">
                <div class="d-flex flex-row align-center">
                    <v-switch
                    @click="toggle(item)"
                    v-model="item.status"
                    :label="`${item.status == 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}`"
                    ></v-switch><span v-if="item.state == 0" class="red--text ml-2 ">(ยกเลิก)</span>
                </div>
            </template>
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
            <template v-slot:[`item.preview`]="{ item }">
                <v-btn
                    color="purple"
                    fab
                    x-small
                    dark
                    @click="previewItem(item.id)"
                    >
                    <i class="fa-solid fa-arrow-up-right-from-square icon-style"></i>
                </v-btn>
            </template>
        </v-data-table>
        <v-row justify="center">
            <v-dialog
                v-model="dialog"
                persistent
                max-width="600px"
                >
                <v-card>
                    <v-card-title class="title-festival">
                        <span class="text-h5">สร้างเทศกาล</span>
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
                                            v-model="item_datas.name"
                                            :rules="nameRules"
                                            label="ชื่อเทศกาล"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <DatePickers ref="startDate" label="เริ่มต้น" :show_date="item_datas.start_date" @change_date="change_start_date"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <DatePickers ref="endDate" label="วันที่สิ้นสุด" :show_date="item_datas.end_date" @change_date="change_end_date"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <TimePickers  ref="startTime" label="ตั้งเเต่เวลา" :show_time="item_datas.start_time" @change_time="change_start_time"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <TimePickers ref="endTime" label="ถึงเวลา" :show_time="item_datas.end_time" @change_time="change_end_time"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <UploadImage ref="image" :files_path="image_path"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <UploadImage ref="background" :files_path="background_path"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <UploadImage ref="button" :files_path="button_path"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <ColorPickers ref="color" :show_color="item_datas.color"/>
                                    </v-col>
                                <v-col cols="12">
                                <v-select
                                    v-model="item_datas.status"
                                    :items="selectStatus"
                                    item-text="value"
                                    item-value="id"
                                    label="สถานะการใช้งาน"
                                    prepend-icon="fa-solid fa-gears"
                                    required
                                
                                    dense
                                ></v-select>
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
                                @click="dialog = false"
                            >
                                ยกเลิก
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>

            <v-dialog
                v-model="dialogEdit"
                persistent
                max-width="600px"
                >
                <v-card>
                    <v-card-title class="title-festival">
                        <span class="text-h5">แก้ไขเทศกาล</span>
                    </v-card-title>
                    <v-form
                        ref="editForm"
                        v-model="valid"
                        lazy-validation
                        enctype="multipart/form-data"
                    >
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="item_datas.name"
                                            :rules="nameRules"
                                            label="ชื่อเทศกาล"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <DatePickers ref="e_startDate" label="วันที่เริ่มต้น" :show_date="item_datas.start_date" @change_date="change_start_date"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <DatePickers ref="e_endDate" label="วันที่สิ้นสุด" :show_date="item_datas.end_date" @change_date="change_end_date"/>
                                    </v-col>
                                 
                                    <v-col cols="12" md="6">
                                    <TimePickers  ref="e_startTime" label="ตั้งเเต่เวลา" :show_time="timeFormat(item_datas.start_date)" @change_time="change_start_time"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                    <TimePickers ref="e_endTime" label="ถึงเวลา" :show_time="timeFormat(item_datas.end_date)" @change_time="change_end_time"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <UploadImage ref="e_image" :files_path="image_path"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <UploadImage ref="e_background" :files_path="background_path"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <UploadImage ref="e_button" :files_path="button_path"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <ColorPickers ref="e_color" :show_color="item_datas.color"/>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-select
                                            v-model="item_datas.status"
                                            :items="selectStatus"
                                            item-text="value"
                                            item-value="id"
                                            label="สถานะการใช้งาน"
                                            prepend-icon="fa-solid fa-gears"
                                            required
                                        
                                            dense
                                        ></v-select>
                                </v-col>
                                
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                class="btn btn-submit"
                                text
                                @click="submitEdit"
                            >
                            บันทึก
                            </v-btn>
                            <v-btn v-if="item_datas.state == 1" color="error" @click="deleteItem(item_datas, 'ลบ')">
                                <i class="fa-solid fa-trash-can mr-1"></i>ลบ
                            </v-btn>
                            <v-btn v-else color="warning" @click="deleteItem(item_datas, 'ยกเลิกการลบ')">
                                <i class="fa-solid fa-trash-can mr-1"></i>ยกเลิกการลบ
                            </v-btn>
                            <v-btn
                                class="btn btn-cancel"
                                text
                                @click="closeEdit"
                              
                            >
                                ยกเลิก
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>
        </v-row>

    </div>
</template>


<script>
import  axios  from "axios";
import moment from 'moment';
import Swal from 'sweetalert2';
import store from '../../store/index.js';
import DatePickers from "@/components/datePickers.vue";
import TimePickers from "@/components/timePickers.vue";
import UploadImage from "@/components/uploadImage.vue";
import ColorPickers from "@/components/colorPickers.vue";
export default {
    components: { DatePickers, TimePickers, UploadImage, ColorPickers },
    data: () => ({
        userId: store.getters.user.id,
        search: "",
        checkbox: false,
        valid: true,
        dialog: false,
        dialogEdit: false,
        editedIndex: -1,
        datas: [],
        check_datas: [],
        item_datas: {},
        get_start_date: null,
        get_end_date: null,
        get_start_time: null,
        get_end_time: null,
        image_path: "",
        background_path: "",
        button_path: "",
        selectStatus: [
            { value: 'ใช้งาน', id: 1 },
            { value: 'ไม่ใช้งาน', id: 0 },
        ],  
        headers: [
            // {
            //     text: "",
            //     align: "start",
            //     sortable: false,
            //     value: "number",
            // },
            { text: "วันที่จัดทำ", value: "create_date" },
            { text: "ชื่อเทศกาล", value: "name" },
            { text: "วันที่เริ่มต้น", value: "start_date" },
            { text: "วันที่สิ้นสุด", value: "end_date" },
            { text: "ตั้งเเต่เวลา", value: "start_time" },
            { text: "ถึงเวลา", value: "end_time" },
            { text: "สถานะ", value: "status", align: "center" },
            { text: "Preview", value: "preview", align: "center", sortable: false },
            { text: "Actions", value: "actions", align: "center", sortable: false },
        ],
        nameRules: [v => !!v || 'กรุณาใส่ข้อมูล'],
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "สร้างเทศกาล" : "แก้ไขเทศกาล";
        },
    },

    mounted() {
        this.getFestival();
    },
    methods: {
        change_start_date(date){
            this.get_start_date = date
        },
        change_end_date(date){
            this.get_end_date = date
        },
        change_start_time(time){
            this.get_start_time = time
        },
        change_end_time(time){
            this.get_end_time = time
        },
        closeEdit () {
            this.dialogEdit         = false
            // this.item_datas         = {}
            this.image_path         = ""
            this.background_path    = ""
            this.button_path        = ""
           
        },

        timeFormat: function (d) {
            return moment(d).format("HH:mm");
        },
        getThaiDate(item) {
            if (item) {
                var d = new Date(item);
                return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
            }
            else {
                return "";
            }
        },
        splitFile(v, type){
            const arr_file      = v.name.split(".");
            const filename      = `${type+this.item_datas.id+'.'+arr_file[1]}`  
            return filename
        },
        previewItem(v){
            const routeData = this.$router.resolve({
            name: "festivalPreview",
            params: { id: v },
            });
            window.open(routeData.href, "_blank");


        },
        deleteItem (item, text) {
        Swal.fire({
            title: 'คำเตือน',
            text: `คุณต้องการ${text}ข้อมูลเทศกาลใช่หรือไม่ ?`,
            // text:  `คุณต้องการลบข้อมูลเทศกาลใช่หรือไม่ ? `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ยกเลิก',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const payload = { 
                    id: item.id,
                    state : item.state === 1 ? '0' : '1',
                    status : item.state ===  1 ?  '0' : '0',
                    user_id: this.userId
                }
                let path =  `/api/deleteFestival`
                let response = await axios.post(`${path}`, payload)


                if(payload){
                    Swal.fire({
                        icon: 'success',
                        text: `${text}ข้อมูลสำเร็จ`,
                    }).then(function(){
                        if(response){
                            window.location.href = '/';
                        }
                    })
                    
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
        async create() {
            this.dialog = await true
            this.editedIndex = await -1
            this.item_datas = await {
                "name"          : "",
                "start_date"    : new Date().toISOString(),
                "end_date"      : new Date().toISOString(),
                "start_time"    : null,
                "end_time"      : null,
                "file_name"     : "",
                "file_bg_name"  : "",
                "file_btn_name" : "",
                "status"        : 0,
            }
        },
        async editItem(v) {
            console.log(v);
            this.dialogEdit       = await true
            this.item_datas       = await JSON.parse(JSON.stringify(v))
            this.image_path       = await `/api/getImageFestival?filename=${v.file_name}`
            this.background_path  = await `/api/getImageFestival?filename=${v.file_bg_name}`
            this.button_path      = await `/api/getImageFestival?filename=${v.file_btn_name}`
        },
        async getFestival() {
            try {
                let path = await `/api/getFestival`;
                let response = await axios.get(`${path}`);
                this.datas = await response.data.data;

                await this.checkState();
            }
            catch (error) {
                console.log("error :" + error);
            }
        },
        async submit(){

            if(this.$refs.form.validate()){

                let fd = await {

                "user_id"       : this.userId,
                "name"          : this.item_datas.name,
                "start_date"    : `${moment(this.get_start_date).format('YYYY-MM-DD') + ' ' + this.get_start_time}`,
                "end_date"      : `${moment(this.get_end_date).format('YYYY-MM-DD') + ' ' + this.get_end_time}`,
                "file_name"     : this.$refs.image.files.name,
                "file_bg_name"  : this.$refs.background.files.name,
                "file_btn_name" : this.$refs.button.files.name,
                "color"         : this.$refs.color.color,
                "status"        : this.item_datas.status ? this.item_datas.status : 0
                
                }

                try {
                    let path = await `/api/createFestival`
                    let res = await axios.post(`${path}`, fd)

                    if(res){
                        setTimeout(() => {
                            this.myUpload('uploadFile',res.data.file_img, this.$refs.image.files);
                        }, 1000);
                        setTimeout(() => {
                            this.myUpload('uploadFileBg',res.data.file_bg, this.$refs.background.files);
                        }, 2000);
                        setTimeout(() => {                            
                            this.myUpload('uploadFileBtn',res.data.file_btn, this.$refs.button.files);
                        }, 1000);

                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'บันทึกสำเร็จ',
                        text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                    }).then( function(){
                    });

                    this.dialog   = await false
                    await this.getFestival()

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
        async submitEdit(){

            if(this.$refs.editForm.validate()){

                if(this.$refs.e_image.files.name){
                var filename = await this.splitFile(this.$refs.e_image.files, 'imgfid_')
                }

                if(this.$refs.e_background.files.name){
                var filename2 = await this.splitFile(this.$refs.e_background.files, 'bgfid_')
                }

                if(this.$refs.e_button.files.name){
                var filename3 = await this.splitFile(this.$refs.e_button.files, 'btnfid_')
                }

                let fd_edit = await {

                    
                "fid"           : this.item_datas.id,
                "user_id"       : this.userId,
                "name"          : this.item_datas.name,
                "start_date"    : `${moment(this.get_start_date).format('YYYY-MM-DD') + ' ' + this.get_start_time}`,
                "end_date"      : `${moment(this.get_end_date).format('YYYY-MM-DD') + ' ' + this.get_end_time}`,
                "file_name"     : this.$refs.e_image.files.name ? filename : this.item_datas.file_name,
                "file_bg_name"  : this.$refs.e_background.files.name ? filename2 : this.item_datas.file_bg_name,
                "file_btn_name" : this.$refs.e_button.files.name ? filename3 : this.item_datas.file_btn_name,
                "color"         : this.$refs.e_color.color,
                "status"        : this.item_datas.status,
                }

                try {

                    let path = await `/api/updateFestival`
                    let res = await axios.post(`${path}`, fd_edit)

                    if(res){

                        // if(this.$refs.e_image.files.name){
                        //     await this.myUpload('uploadFile', filename, this.$refs.e_image.files);
                        // }

                        // if(this.$refs.e_background.files.name){
                        //     await this.myUpload('uploadFileBg', filename2, this.$refs.e_background.files);
                        // }

                        // if(this.$refs.e_button.files.name){
                        //     await this.myUpload('uploadFileBtn', filename3, this.$refs.e_button.files);
                        // }
                        if(this.$refs.e_image.files.name){
                            setTimeout(() => {
                                this.myUpload('uploadFile',filename, this.$refs.e_image.files);
                            }, 1000);
                        }

                        if(this.$refs.e_background.files.name){
                            setTimeout(() => {
                                this.myUpload('uploadFileBg', filename2, this.$refs.e_background.files);
                            }, 2000);
                        }

                        if(this.$refs.e_button.files.name){
                            setTimeout(() => {                            
                                this.myUpload('uploadFileBtn',filename3, this.$refs.e_button.files);
                            }, 1000);
                        }


                    }
                    Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ',
                    text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว' 
                    }).then( function(){
                    });
                    this.dialogEdit = await false
                    await this.getFestival()

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

        async toggle(v){
            Swal.fire({
            title: 'คำเตือน',
            text: "คุณต้องการเปลี่ยนสถานะข้อมูลเทศกาลใช่หรือไม่ ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const payload = { 
                        fid       : v.id,
                        user_id   : this.userId,
                        status     : v.status ? 1 : 0
                    }
                    let path      = `/api/updateFestivalStatus`
                    let response = await axios.post(`${path}`, payload)

                    this.$store.dispatch('checkFestival')

                    if(payload){
                        Swal.fire({
                            icon: 'success',
                            text: 'บันทึกข้อมูลเรีบร้อยเเล้ว',
                        })

                        if(response){
                        await this.getFestival()
                        }
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'บันทึกไม่สำเร็จ',
                            text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
                        })
                    }    
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                v.status == 1 ? v.status = 0 : v.status = 1
                }
            }) 
        },

        async myUpload(path, file_name, files){

            try {

                let fd_upload =  await new FormData();
                await fd_upload.append('image_name', file_name);
                await fd_upload.append('images', files);

                let res2  = await axios.post(`/api/${path}`, fd_upload)
                
                console.log(res2);
            
            } catch (error) {

                console.log(error);

            }

        },

        async checkState(){
            // const datas = await v
            
            if(!this.checkbox){
                const result = await this.datas.filter(data => data.state == 1);
                this.check_datas = await JSON.parse(JSON.stringify(result));
            }else{
                this.check_datas = await JSON.parse(JSON.stringify(this.datas))
            }

      },
    },

}
</script>
<style>
    .v-data-table-header{
        background-color: #0170c2;
    }
    th span{
           color: white!important;
    }
    .title-festival{
        border-bottom: 2px solid #0170c2;
    }
    .btn-create{
        background-color: #213862!important;
        border: 1px solid #213862;
        color: white!important;
    }
    .btn-preview{
      cursor: pointer;
    }
    /* .preview{
      width: 70px;
      height: 70px;
      border: 1px solid #ddd;
      cursor: pointer;
    }
    .preview img{
      width: 100%;
    }
    .btn-overlay{
      position: absolute;
      top: -2rem;
    }
    .remove-icon{
      max-width: 20px;
      max-height: 20px;
    }
    .remove-icon .v-icon{
      max-width: 14px;
      max-height: 14px;
    }
    .style-bg .v-overlay__content{
      width: auto;
      height: 600px;
      max-width: 700px;
    }

    .style-bg img{
      width: 100%;
    }

    .text-img{
      color: #213862;
      font-size: 12px;
    }

    .red--text{
      font-size: 13px;
    } */

    .v-input--checkbox .v-input__slot{
      margin-bottom: 0px!important;
    }
    .v-input--checkbox .v-messages{
      min-height: inherit!important;
    }
</style>
