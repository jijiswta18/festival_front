<template >
  <v-data-table
    :headers="headers"
    :items="datas"
    sort-by="calories"
    class="elevation-1"
  >

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>รายการเทศกาล</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="700px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mb-2 btn-create"
              v-bind="attrs"
              v-on="on"
              @click="create"
            >
            สร้าง
            </v-btn>
          </template>
        
            <!-- create -->
            <v-card>
                <v-card-title class="title-festival">
                <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    enctype="multipart/form-data"
                  >
                    <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.name"
                              :rules="nameRules"
                              label="ชื่อเทศกาล"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>

                          <v-col cols="6">
                            <v-menu
                              v-model="menu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                         
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  :value="DateFormatStart"
                                  label="วันที่เริ่มต้น"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.start_date"
                                no-title
                                locale="th"
                                :max="editedItem.end_date"
                                @input="menu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>

                          <v-col cols="6">
                            <v-menu
                              v-model="menu2"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                           
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  :value="DateFormatEnd"
                                  clearable
                                  label="วันที่สิ้นสุด"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  @click:clear="editedItem.end_date = null"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.end_date"
                                no-title
                                locale="th"
                                :min="editedItem.start_date"
                                @input="menu2 = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="6">
                              <v-menu
                                ref="menu3"
                                v-model="menu3"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="editedItem.start_time"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                              >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.start_time"
                                  :rules="startRules"
                                  clearable
                                  label="ตั้งเเต่เวลา"
                                  prepend-icon="mdi-clock-time-four-outline"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  @click:clear="editedItem.start_time = null"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-model="editedItem.start_time"
                                format="24hr"
                                :max="editedItem.end_time"
                                full-width
                                @click:minute="$refs.menu3.save(editedItem.start_time)"
                              ></v-time-picker>
                            </v-menu>
                          </v-col>  

                          <v-col cols="6">
                              <v-menu
                                ref="menu4"
                                v-model="menu4"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="editedItem.end_time"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                              >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.end_time" 
                                  :rules="endRules"
                                  clearable
                                  label="ถึงเวลา"
                                  prepend-icon="mdi-clock-time-four-outline"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  @click:clear="editedItem.end_time = null"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-model="editedItem.end_time" 
                                format="24hr"
                                :min="editedItem.start_time"
                                full-width
                                @click:minute="$refs.menu4.save(editedItem.end_time)"
                              ></v-time-picker>
                            </v-menu>
                          </v-col>  
                        </v-row>

                        <v-row>
                          <v-col cols="6">
                            <v-file-input
                              id="file"
                              accept="image/png, image/jpeg, image/bmp"
                              prepend-icon="mdi-camera"
                              label="เเนบรูปเทศกาล"
                              v-model="editedItem.files"
                              
                            ></v-file-input>

                            <div v-if="url" class="preview">
                              <img :src="url" />
                              <!-- <p>{{editedItem.files}}</p> -->
                              
                            </div>    
                          </v-col>

                          <v-col cols="6">
                            <v-file-input
                              accept="image/png, image/jpeg, image/bmp"
                              prepend-icon="mdi-camera"
                              label="เเนบรูปพื้นหลัง"
                              v-model="editedItem.files_bg"
                            ></v-file-input>

                            <div v-if="urlBg" class="preview">
                              <!-- <img :src="getImgUrl(editedItem.files_bg)" > -->
                              <img :src="urlBg" />
                            </div>    
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="6">
                            <v-file-input
                              id="file"
                              accept="image/png, image/jpeg, image/bmp"
                              prepend-icon="mdi-camera"
                              label="เเนบรูปปุ่มลงนาม"
                              v-model="editedItem.files_btn"
                            ></v-file-input>

                            <div v-if="urlBtn" class="preview">
                              <img :src="urlBtn" />
                            </div>    
                          </v-col>

                          <v-col cols="6">
                            <!-- <v-color-picker 
                              v-model="color"
                              mode="hexa"
                              flat 
                            ></v-color-picker> -->

                            <v-text-field v-model="color" hide-details class="ma-0 pa-0" solo>
                              <template v-slot:append>
                                <v-menu v-model="color_menu" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
                                  <template v-slot:activator="{ on }">
                                    <div :style="swatchStyle" v-on="on" />
                                  </template>
                                  <v-card>
                                 
                                    <v-card-text class="pa-0">
                                      <v-color-picker   mode="hexa" v-model="color" show-swatches />
                                    </v-card-text>
                                  </v-card>
                                </v-menu>
                              </template>
                            </v-text-field>

                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                              <v-select
                                v-model="editedItem.status"
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
                  </v-form>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    class="btn btn-cancel"
                    text
                    @click="close"
                >
                    ยกเลิก
                </v-btn>
                <v-btn
                    class="btn btn-submit"
                    text
                    @click="submit"
                >
                    บันทึก
                </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.start_date`]="{ item }">{{getThaiDate(item.start_date)}}</template>
    <template v-slot:[`item.end_date`]="{ item }">{{getThaiDate(item.end_date)}}</template>
    <template v-slot:[`item.start_time`]="{ item }">{{timeFormat(item.start_date)}}</template>
    <template v-slot:[`item.end_time`]="{ item }">{{timeFormat(item.end_date)}}</template>
    <template v-slot:[`item.create_date`]="{ item }">{{getThaiDate(item.create_date)}}</template>
    <template v-slot:[`item.status`]="{ item }">
     <v-switch
        @click="toggle(item)"
        v-model="item.status"
        :label="`${item.status == 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}`"
      ></v-switch>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <!-- <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon> -->
    </template>
  </v-data-table>

</template>
<script>
  import  axios  from "axios";
  import moment from 'moment';
  import Swal from 'sweetalert2';
  import store from '../../store/index.js';
  export default {
  components: { },
    data: () => ({
      dialog: false,
      headers: [
        // {
        //   text: 'ลำดับ',
        //   align: 'start',
        //   sortable: false,
        //   value: 'number',
        // },

        { text: 'ชื่อเทศกาล', value: 'name' },
        { text: 'วันที่เริ่มต้น', value: 'start_date' },
        { text: 'วันที่สิ้นสุด', value: 'end_date' },
        { text: 'ตั้งเเต่เวลา', value: 'start_time' },
        { text: 'ถึงเวลา', value: 'end_time' },
        // { text: 'ผู้ร้องขอ', value: 'create_by' },
        { text: 'วันที่สร้าง', value: 'create_date' },
        { text: 'สถานะ', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
       date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      id: null,
      name: '',
      start_date: '',
      end_date:  '',
      start_time: null,
      end_time: null,
      create_date: '',
      status: {value : '', id : null},
      switch: true,
      test: '',
      files: null,
      files_bg: null,
      files_btn: null,
      color: '#1976D2FF',
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      color_menu: false,
      userId: store.getters.user.id,
      datas: [],
      editedIndex: -1,
      valid: true,
      img_path : '',
      bg_path : '',
      editedItem: {},
      defaultItem: {},
      nameRules: [
        v => !!v || 'Name is required',
      ],
      
      selectRules: [
        v =>  !!v && v.length> 0 || "Item is required in select 2"
      ],
      startRules: [v => !!v || "This field is required"],
      endRules: [v => !!v || "This field is required"],
      selectStatus: [
        { value: 'ใช้งาน', id: 1 },
        { value: 'ไม่ใช้งาน', id: 0 },
      ],  
      }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'สร้างเทศกาล' : 'แก้ไขเทศกาล'
      },
      DateFormatStart () {

        let d_start       = new Date(this.editedItem.start_date);
        let d_option      = d_start.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        let d_now         = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        
        return this.editedItem.start_date ? d_option : d_now
      
      },
      DateFormatEnd () {

        let d_end         = new Date(this.editedItem.end_date);
        let d_option      = d_end.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        let d_now         = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        
        return this.editedItem.end_date ? d_option : d_now
      },
      url() {
        return  this.editedItem.files ? URL.createObjectURL(this.editedItem.files) : this.img_path;
      },
      urlBg() {
        return  this.editedItem.files_bg ? URL.createObjectURL(this.editedItem.files_bg) : this.bg_path;
      },
      urlBtn() {
        return  this.editedItem.files_btn ? URL.createObjectURL(this.editedItem.files_btn) : this.btn_path;
      },
    
      swatchStyle() {
        const { color, color_menu } = this
        // console.log(color);
        // console.log(menu);
        return {
          backgroundColor: color,
          cursor: 'pointer',
          height: '30px',
          width: '30px',
          borderRadius: color_menu ? '50%' : '4px',
          transition: 'border-radius 200ms ease-in-out'
        }
    }

    },

    watch: {
      dialog (val) {
        val || this.close() 
      },
     
    },

    mounted(){
      this.getFestival()
    },

    methods: {
      timeFormat:function(d){
        return moment(d).format('HH:mm');
      },
      getThaiDate(item){
        if (item){
          var d = new Date(item);
          return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        }else{
          return "";
        }            
      },
      create (){
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      async editItem (item) {
        this.editedItem             = await JSON.parse(JSON.stringify(item))
        this.editedItem.start_time  = await moment(item.start_date).format('HH:mm')
        this.editedItem.end_time    = await moment(item.end_date).format('HH:mm')
        this.img_path               = await `${axios.defaults.baseURL}/uploads/${item.file_name}`;
        this.bg_path                = await `${axios.defaults.baseURL}/uploads/${item.file_bg_name}`;
        this.btn_path               = await `${axios.defaults.baseURL}/uploads/${item.file_btn_name}`;
        this.color                  = await item.color
        this.dialog                 = await true
        this.editedIndex            = 1
      },
      deleteItem (item) {
        Swal.fire({
            title: 'คำเตือน',
            text: "คุณต้องการลบข้อมูลเทศกาลใช่หรือไม่ ?",
            icon: 'warning',
            showCancelButton: true,
            // confirmButtonColor: '#3085d6',
            // cancelButtonColor: '#d33',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const payload = { 
                    id: item.id,
                    user_id: this.userId
                }
                let path =  `/api/deleteFestival`
                let response = await axios.post(`${path}`, payload)

                if(payload){
                    Swal.fire({
                        icon: 'success',
                        // title: 'เรียบร้อย',
                        text: 'ลบข้อมูลพนักงานสำเร็จ',
                    })
                    if(response){
                        window.location.href = '/';
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
        // this.editedIndex = this.desserts.indexOf(item)
        // this.editedItem = Object.assign({}, item)
      },
      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      close () {
        this.dialog = false
        if(this.editedIndex === -1){
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            // this.editedIndex = -1
          })
        }

      },

      closeDelete () {
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      async getFestival () {
        try {
          let path = await `/api/getFestival`
          let response = await axios.get(`${path}`)
          this.datas = response.data.data

          // response.data.data.forEach(item => {
          //     this.test.push({'switch':item.state == '1' ? true : false})
          // })


          console.log( this.datas );
        } catch (error) {
             console.log('error :' + error)
        }
      },
      async submit () {  
    
        if(this.$refs.form.validate()){
          

          // แก้ไข
          if(this.editedIndex > -1){

            if(this.editedItem.files){
              var filename = this.splitFile(this.editedItem.files, 'imgfid_')
            }

            if(this.editedItem.files_bg){
              var filename2 = this.splitFile(this.editedItem.files_bg, 'bgfid_')
            }

            if(this.editedItem.files_btn){
              var filename3 = this.splitFile(this.editedItem.files_btn, 'btnfid_')
            }
            
           
            // const arr_file      =  this.editedItem.files.name.split(".");
            // const filename    = `${'imgfid_'+this.editedItem.id+'.'+arr_file[1]}`  

            // let arr_file2     = await this.editedItem.files_bg.name.split(".");
            // let arr_file3     = await this.editedItem.files_btn.name.split(".");
          
          
            // let filename2  = `${'bgfid_'+this.editedItem.id+'.'+arr_file2[1]}`
            // let filename3  = `${'btnfid_'+this.editedItem.id+'.'+arr_file3[1]}`
            
            let fd_edit = {
              "fid"           : this.editedItem.id,
              "user_id"       : this.userId,
              "name"          : this.editedItem.name,
              "color"         : this.color,
              "start_date"    : `${moment(this.editedItem.start_date).format('YYYY-MM-DD') + ' ' + this.editedItem.start_time}`,
              "end_date"      : `${moment(this.editedItem.end_date).format('YYYY-MM-DD') + ' ' + this.editedItem.end_time}`,
              "file_name"     : this.editedItem.files ? filename : this.editedItem.file_name,
              "file_bg_name"  : this.editedItem.files_bg ? filename2 : this.editedItem.file_bg_name,
              "file_btn_name" : this.editedItem.files_btn ? filename3 : this.editedItem.file_btn_name,
              "status"        : this.editedItem.status
            }
     
            try {
              let path = await `/api/updateFestival`
              let res = await axios.post(`${path}`, fd_edit)
              console.log(res);

              if(res){

                  // รูปภาพ
                  let fd2 = new FormData();
                  fd2.append('image_name', filename);
                  fd2.append('image', this.editedItem.files);

                  let path2 = await `/api/uploadFile`
                  let res2  = await axios.post(`${path2}`, fd2)
                  console.log(res2);

                  // พื้นหลัง
                  let fd3 = new FormData();
                  fd3.append('image_name', filename2);
                  fd3.append('image', this.editedItem.files_bg);
              
                  let path3 = await `/api/uploadFileBg`
                  let res3  = await axios.post(`${path3}`, fd3)
                  console.log(res3);

                  // ปุ่มลงนาม
                  let fd4 = new FormData();
                  fd4.append('image_name', filename3);
                  fd4.append('image', this.editedItem.files_btn);
              
                  let path4 = await `/api/uploadFileBg`
                  let res4  = await axios.post(`${path4}`, fd4)
                  console.log(res4);
    
                }
              Swal.fire({
                  icon: 'success',
                  title: 'บันทึกสำเร็จ',
                  text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว' 
              }).then( function(){
                  // window.location.href = '/';
              });
              this.dialog = false
              await this.getFestival()

            } catch (error) {
              Swal.fire({
                  icon: 'error',
                  title: 'บันทึกไม่สำเร็จ',
                  text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
              })
              console.log('error :' + error)
            }

          // สร้าง
          }else{

            let fd = {
              "user_id"       : this.userId,
              "name"          : this.editedItem.name,
              "start_date"    : this.editedItem.start_date ? `${this.editedItem.start_date + ' ' + this.editedItem.start_time}` : `${this.date + ' ' + this.editedItem.start_time}`,
              "end_date"      : this.editedItem.end_date ? `${this.editedItem.end_date + ' ' + this.editedItem.end_time}` : `${this.date + ' ' + this.editedItem.end_time}`,
              "file_name"     : this.editedItem.files.name,
              "file_bg_name"  : this.editedItem.files_bg.name,
              "file_btn_name" : this.editedItem.files_btn.name,
              "color"         : this.color,
              "status"        : this.editedItem.status
            }

            console.log(fd);

            try {

                let path = await `/api/createFestival`
                let res = await axios.post(`${path}`, fd)

                if(res){

                  //รูปภาพ
                  let fd2 = new FormData();
                  fd2.append('image_name', res.data.file_img);
                  fd2.append('image', this.editedItem.files);

                  let path2 = await `/api/uploadFile`
                  let res2  = await axios.post(`${path2}`, fd2)
                  console.log(res2);

                  //พื้นหลัง
                  let fd3 = new FormData()
                  fd3.append('image_name', res.data.file_bg);
                  fd3.append('image', this.editedItem.files_bg);

                  let path3 = await `/api/uploadFileBg`
                  let res3  = await axios.post(`${path3}`, fd3)
                  console.log(res3);

                  //ปุ่มลงนาม
                  let fd4 = new FormData()
                  fd4.append('image_name', res.data.file_btn);
                  fd4.append('image', this.editedItem.files_btn);

                  let path4 = await `/api/uploadFileBtn`
                  let res4  = await axios.post(`${path4}`, fd4)
                  console.log(res4);


                }
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ',
                    text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                }).then( function(){
                });
                  this.dialog = await false
                 await this.getFestival()
                console.log(res);
            } catch (error) {
              Swal.fire({
                  icon: 'error',
                  title: 'บันทึกไม่สำเร็จ',
                  text: 'มีข้อผิดพลาดที่ไม่คาดคิดเกิดขึ้น โปรดลองใหม่อีกครั้ง'
              })
              console.log('error :' + error)
            }
          
          }
        }
      },

      splitFile(v, type){
        const arr_file      = v.name.split(".");
        const filename      = `${type+this.editedItem.id+'.'+arr_file[1]}`  
        return filename
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
                console.log(payload);
                let path      = `/api/updateFestivalStatus`
                let response = await axios.post(`${path}`, payload)

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
    .preview{
      width: 50px;
      height: 50px;
      border: 1px solid #ddd;
    }
    .preview img{
      width: 100%;
    }
</style>
