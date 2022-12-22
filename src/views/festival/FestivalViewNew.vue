<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="check_datas"
            :search="search"
            :loading="loadTable"
            loading-text="Loading..."
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
                        <i class="fa-solid fa-plus icon-style mr-1"></i>
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
                        label="ค้นหา (ชื่อเทศกาล)"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-toolbar>
            </template>
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
            <template v-slot:[`item.status_reference`]="{ item }">
                <div class="d-flex flex-row align-center">
                    <v-switch
                    @click="toggleReference(item)"
                    v-model="item.status_reference"
                    :label="`${item.status_reference == 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}`"
                    ></v-switch>
                </div>
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
            <template v-slot:[`item.reference`]="{ item }">
                <v-btn
                    color="primary"
                    fab
                    x-small
                    dark
                    
                    @click="referenceItem(item)"
                    >
                    <i class="fa-solid fa-list-check f-18"></i>
                </v-btn>
            </template>
        </v-data-table>
        <v-row justify="center">
            <v-dialog
                v-model="dialog"
                persistent
                max-width="700px"
                >
                <v-card class="style-front">
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
                                    <v-col cols="12">
                                        <v-textarea
                                            name="input-7-1"
                                            label="รายละเอียดเทศกาล"
                                            rows="2"
                                            v-model="item_datas.detail"
                                            :rules="detailRules"
                                            
                                        ></v-textarea>
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
                                        <UploadImage ref="image" label="เเนบรูปเทศกาล" width="700" height="600" :files_path="image_path"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <UploadImage ref="background" label="เเนบรูปพื้นหลังเทศกาล" width="3840" height="2160" :files_path="background_path"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <UploadImage ref="button" label="เเนบรูปปุ่มลงนามถวายพระพร" width="186" height="58" :files_path="button_path"/>
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
                                @click="close"
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
                max-width="700px"
                >
                <v-card class="style-front">
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
                                    <v-col cols="12">
                                        <v-textarea
                                            name="input-7-1"
                                            label="รายละเอียดเทศกาล"
                                            rows="2"
                                            v-model="item_datas.detail"
                                            :rules="detailRules"
                                        ></v-textarea>
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
                                        <UploadImage ref="e_image" label="เเนบรูปเทศกาล" width="700" height="600" :files_path="image_path"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <UploadImage ref="e_background" label="เเนบรูปพื้นหลังเทศกาล" width="3840" height="2160" :files_path="background_path"/>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <UploadImage ref="e_button" label="เเนบรูปปุ่มลงนามถวายพระพร" width="186" height="58" :files_path="button_path"/>
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
            
            <v-dialog
                v-model="dialogReference"
                persistent
                max-width="900px"
                >
                <v-card class="style-front">
                    <v-toolbar class="title-festival">
                        <v-toolbar-title>คำอวยพร</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn
                            icon
                            dark
                            color="cyan"
                            colored-border
                            @click="closeReference"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>


                    <v-tabs v-model='tab' vertical>

                        <v-tab class="justify-start" href='#tab-1'>
                            <i class="fa-solid fa-list mr-2  f-18"></i>
                            รายการคำอวยพร
                        </v-tab>

                        <v-tab class="justify-start" href='#tab-2'>
                            <i class="fa-solid fa-plus icon-style mr-2 f-18"></i>
                            เพิ่มคำอวยพร
                        </v-tab>

                        <v-tab class="justify-start" href='#tab-3'>
                            <i class="fa-solid fa-list-check mr-2 f-18"></i>
                            เลือกคำอวยพร
                        </v-tab>

                        <v-tab-item value='tab-1'>
                            <v-card flat>
                            <v-card-text>
                                <v-list-item
                                    v-for="(refDetail, i) in refDetails" 
                                    :key="i"
                                >
                                    <v-list-item-content>
                                        <span class="line-height" v-text="refDetail.name"></span>  
                                    </v-list-item-content>
                                    <v-list-item-icon>
                                        <v-btn
                                        class="mx-2"
                                        fab
                                        dark
                                        x-small
                                        color="primary"
                                        @click="deleteReference(refDetail)"
                                        >
                                            <i class="fa-solid fa-trash-can f-14"></i>
                                        </v-btn>
                                    </v-list-item-icon>
                                </v-list-item>
                            </v-card-text>
                            </v-card>
                        </v-tab-item>

                        <v-tab-item value='tab-2'>
                            <v-card flat>
                                <v-card-text>
                                    <v-text-field
                                        label="เพิ่มคำอวยพร"
                                        v-model="reference_name"
                                        solo
                                        clearable
                                    ></v-text-field>
                                </v-card-text>
                                <v-card-actions class="justify-center">
                                    <v-btn 
                                        class="btn btn-submit"
                                        text 
                                        @click="addReference"
                                    >บันทึก</v-btn>
                                 
                                </v-card-actions>
                            </v-card>
                        </v-tab-item>

                        <v-tab-item value='tab-3'>
                            <v-card flat>
                                <v-card-text>
                                  
                                    <v-select
                                    v-model="reference"
                                    :items="selectReference"
                                    item-text="value"
                                    item-value="id"
                                    item-disabled="disable"
                                    solo
                                    label="เลือกรายการคำอวยพร"
                                    multiple
                                    >
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip v-if="index === 0">
                                        <span>{{ item.value }}</span>
                                        </v-chip>
                                        <span
                                        v-if="index === 1"
                                        class="grey--text text-caption"
                                        >
                                        (+{{ reference.length - 1 }} รายการ)
                                        </span>
                                    </template>
                                    </v-select>
                                </v-card-text>
                                <v-card-actions class="justify-center">
                                    <v-btn    
                                        @click="addSelectReference"
                                        class="btn btn-submit"
                                        text 
                                    >บันทึก</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
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
        dialogReference: false,
        tab: 'tab-1',
        editedIndex: -1,
        loadTable: true,
        loadDialog: false,
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
        festival_id: '', 
        reference_name: '',
        refDetails: [],
        reference: [],
        selectReference: [], 
        listFestival: [],
        headers: [
            { text: "วันที่จัดทำ", value: "create_date" },
            { text: "ชื่อเทศกาล", value: "name" },
            { text: "วันที่เริ่มต้น", value: "start_date" },
            { text: "วันที่สิ้นสุด", value: "end_date" },
            { text: "ตั้งเเต่เวลา", value: "start_time" },
            { text: "ถึงเวลา", value: "end_time" },
            { text: "สถานะ", value: "status", align: "center" },
            { text: "สถานะคำอวยพร", value: "status_reference", align: "center" },
            { text: "แก้ไข", value: "actions", align: "center", sortable: false },
            { text: "คำอวยพร", value: "reference", align: "center", sortable: false },
            { text: "Preview", value: "preview", align: "center", sortable: false },
        ],
        nameRules: [
            v => !!v || 'กรุณาใส่ข้อมูล',
            v => ( v && v.length <= 255 ) || "ห้ามใส่ข้อมูลเกิน 255 ตัวอักษร",
        ],
      
        detailRules: [
            v => !!v || 'กรุณาใส่ข้อมูล',
            v => ( v && v.length <= 512 ) || "ห้ามใส่ข้อมูลเกิน 512 ตัวอักษร",
        ],

    }),
    mounted() {
        this.getFestival();

        
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "สร้างเทศกาล" : "แก้ไขเทศกาล";
        },
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
        close(){
            this.dialog = false
            this.$refs.form.resetValidation()
        },
        closeEdit () {
            this.dialogEdit         = false
            this.image_path         = ""
            this.background_path    = ""
            this.button_path        = ""
            this.$refs.editForm.resetValidation()
        },
        async closeReference(){
            this.dialogReference = await false
            this.reference = [],
            this.selectReference = [], 
            this.tab = await 'tab-1'
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
        async mapselectReference(){

            this.reference = await []
            await this.refDetails.forEach(x=>{
                this.reference.push(x.id)
            })
   
        },

        async deleteReference(v){
            Swal.fire({
                title: 'คำเตือน',
                text: "คุณต้องการลบคำอวยพรใช่หรือไม่ ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่',
                cancelButtonText: 'ยกเลิก',
            }).then(async (result) => {
                if (result.isConfirmed) {

                    let arr = JSON.parse(v.tag_festival)

                  
                    arr.splice(arr.indexOf(`${this.festival_id}`), 1)


                    const payload = {
                        id : v.id,
                        tag_festival : JSON.stringify(arr),
                        user_id : this.userId,
                    }

                    console.log(payload);

                    let path =  await `/api/update/deleteReference`
                    let response = await axios.post(`${path}`, payload)
                    
                    if(response){
                        await Swal.fire({
                            icon: 'success',
                            text: 'ลบข้อมูลสำเร็จ',
                        })

                        await this.getReference()
                        await this.getSelectReference()
                        await this.mapselectReference()

 
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
        async addSelectReference(){

            try {
      
                this.reference.forEach(async (value) =>  {

                    const items = await this.listFestival.find((x => x.id == value))
                    
                    const json = await JSON.parse(items.tag_festival)

                    if(!json.includes(`${this.festival_id}`)){

                        await json.push(`${this.festival_id}`)
                   
                    }

                    var obj = await {};
                    obj["user_id"]      =   await this.userId;
                    obj["id"]           =   await value
                    obj["tag_festival"] =   await JSON.stringify(json)

                    let path_edit   = await `api/update/selectreference`
                    let res_edit    = await axios.post(`${path_edit}`, obj)
                    
                    console.log(res_edit);

                })

             
                await Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ',
                    text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                }).then(function(){    
                   
                });

                    await this.getReference()
                    await this.getSelectReference()
                    await this.mapselectReference()
                    // this.tab = await 'tab-1'         


            } catch (error) {
                console.log('addReference' + error);
            }
        
        },
        async addReference(){

            try {

                let fd_refernce = await {
                    "user_id"       : this.userId,
                    "name"          : this.reference_name,
                    "tag_festival"  : JSON.stringify([new String(this.festival_id)])
                }

                let path            = await `api/create/reference`
                let res_refernce    = await axios.post(`${path}`, fd_refernce)

                console.log(res_refernce);

                    await Swal.fire({
                        icon: 'success',
                        title: 'บันทึกสำเร็จ',
                        text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                    }).then(async function(){
                    
                    });

                    this.reference_name = await ''
                    await this.getReference()
                    await this.mapselectReference()
                    await this.getSelectReference()

                    

            } catch (error) {
                console.log('addReference' + error);
            }
        
        },
        async create() {
            this.dialog = await true
            this.editedIndex = await -1
            this.item_datas = await {
                // "name"          : "",
                // "detail"        : "",
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
            this.dialogEdit       = await true
            this.item_datas       = await JSON.parse(JSON.stringify(v))
            this.image_path       = await `/api/getImageFestival?filename=${v.file_name}`
            this.background_path  = await `/api/getImageFestival?filename=${v.file_bg_name}`
            this.button_path      = await `/api/getImageFestival?filename=${v.file_btn_name}`
        },
        async referenceItem(v){
            this.dialogReference = await true
            this.festival_id = await v.id

            await this.getReference()
            await this.getSelectReference();
            await this.mapselectReference();

        },
        async getFestival() {
            try {
                let path = await `/api/getFestival`;
                let response = await axios.get(`${path}`);
                this.datas = await response.data.data;
                await this.checkState();
                this.loadTable = await false;
            }
            catch (error) {
                console.log("error :" + error);
            }
        },

        async getReference(){
            try {
                let path = await `/api/get/detailReference`;
                let response = await axios.get(`${path}/`+ this.festival_id) 
                this.refDetails = await response.data.data
                await this.mapselectReference()
            }
            catch (error) {
                console.log("error :" + error);
            }
        },

        async getSelectReference(){


            let path = await `/api/get/listReference`;

            let response = await axios.get(`${path}`);
            
            this.listFestival = await response.data.data

            this.selectReference = await []

            await response.data.data.forEach(async item => {


                let check_disabled = await false

                if(!item.tag_festival.includes(`${this.festival_id}`)){

                    check_disabled = await false
                 
                }else{

                    check_disabled = await true

                }

                await this.selectReference.push({'id':item.id, 'value':item.name, 'disable': check_disabled})
           
            })
  
        },
       
        async submit(){

            if(this.$refs.form.validate()){

                let fd = await {

                "user_id"           : this.userId,
                "name"              : this.item_datas.name,
                "detail"            : this.item_datas.detail,
                "start_date"        : `${moment(this.get_start_date).format('YYYY-MM-DD') + ' ' + this.get_start_time}`,
                "end_date"          : `${moment(this.get_end_date).format('YYYY-MM-DD') + ' ' + this.get_end_time}`,
                "file_name"         : this.$refs.image.files.name,
                "file_bg_name"      : this.$refs.background.files.name,
                "file_btn_name"     : this.$refs.button.files.name,
                "color"             : this.$refs.color.color,
                "status"            : this.item_datas.status ? this.item_datas.status : 0,
                "status_reference"  : 0
                
                }

                try {
                    let path = await `/api/createFestival`
                    let res = await axios.post(`${path}`, fd)

                    if(res){
                        setTimeout(() => {
                            this.myUpload('uploadFile',res.data.file_img,  this.$refs.image.files);
                        }, 2000);
                        setTimeout(() => {
                            this.myUpload('uploadFileBg',res.data.file_bg, this.$refs.background.files);
                        }, 4000);
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
                "detail"          : this.item_datas.detail,
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
                            }, 2000);
                        }

                        if(this.$refs.e_background.files.name){
                            setTimeout(() => {
                                this.myUpload('uploadFileBg', filename2, this.$refs.e_background.files);
                            }, 4000);
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
        async toggleReference(v){

            console.log(v);
            Swal.fire({
            title: 'คำเตือน',
            text: "คุณต้องการเปลี่ยนสถานะรายการคำอวยพรใช่หรือไม่ ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const payload = { 
                        fid                 : v.id,
                        user_id             : this.userId,
                        status_reference    : v.status_reference ? 1 : 0
                    }
                    let path      = `/api/updateReferenceStatus`
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
        border-bottom: 2px solid #0170c2!important;
    }
    .btn-create{
        background-color: #213862!important;
        border: 1px solid #213862;
        color: white!important;
    }
    .btn-preview{
      cursor: pointer;
    }
    .v-tab.v-tab--active {
        background: #0170c2!important;
        color: white!important;
    }
    .v-tabs-slider {
        background-color: #213862!important;
      
    }
    .line-height{
        line-height: inherit!important;
    }
    .f-14{
        font-size: 14px;
    }
    .f-18{
        font-size: 18px;
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
    [aria-selected="true"] :disabled {
  background: red;
}
</style>
