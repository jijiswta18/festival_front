<template >
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
        <v-dialog
          v-model="dialog"
          max-width="700px"
        >
          <!-- สร้าง -->
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

                        <v-col cols="12" md="6">
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

                        <v-col cols="12" md="6">
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
                        <v-col cols="12" md="6">
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

                        <v-col cols="12" md="6">
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
                        <v-col cols="12" md="6">
                          <v-file-input
                            v-if="!img_path"
                            id="file"
                            accept="image/png, image/jpeg"
                            prepend-icon="mdi-camera"
                            label="เเนบรูปเทศกาล"
                            v-model="editedItem.files"
                            :rules="rules.filesRules" 
                            @change="onFileChange(editedItem.files, 'img')"
                          ></v-file-input>

                          <div v-if="img_path">
                            <label for="img_path">เเนบรูปเทศกาล</label>
                            <div class="d-flex flex-row align-center">
                              <div class="preview" @click="overlayImg = !overlayImg">
                                <img :src="img_path" />
                              </div>    
                              <v-btn
                                class="mx-2 remove-icon"
                                fab
                                dark
                                x-small
                                color="pink"
                                @click="removePreview('img')"
                                
                              >
                                <v-icon dark>
                                  fa-xmark
                                </v-icon>
                              </v-btn>
                              <span class="text-img">ขนาดไม่เกิน 700px * 600px</span>

                            </div>
                            
                            <v-overlay class="style-bg" :opacity="opacity"  :z-index="zIndex" :absolute="absolute" :value="overlayImg">
                              <img :src="img_path" />
                             
                              <v-btn
                                class="btn-overlay"
                                icon
                                @click="overlayImg = false"
                              >
                              <v-icon  dark>
                                fa-xmark
                              </v-icon>
                              </v-btn>
                            </v-overlay>

                          </div>
                        
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-file-input
                            v-if="!bg_path"
                            accept="image/png, image/jpeg"
                            prepend-icon="mdi-camera"
                            label="เเนบรูปพื้นหลัง"
                            v-model="editedItem.files_bg"
                            :rules="rules.filesBgRules" 
                            @change="onFileChange(editedItem.files_bg, 'bg')"
                          ></v-file-input>


                          <div v-if="bg_path">
                            <label for="bg_path">เเนบรูปพื้นหลัง</label>
                            <div class="d-flex flex-row align-center">
                              <div class="preview" @click="overlayBg = !overlayBg">
                                <img :src="bg_path"/> 
                              </div> 
                              <v-btn
                                class="mx-2 remove-icon"
                                fab
                                dark
                                x-small
                                color="pink"
                                @click="removePreview('bg')"
                              >
                                <v-icon dark>
                                  fa-xmark
                                </v-icon>
                              </v-btn> 
                              <span class="text-img">ขนาดไม่เกิน 900px * 900px</span>
                            </div>
                            
                            <v-overlay class="style-bg" :opacity="opacity"  :z-index="zIndex" :value="overlayBg">
                              <img :src="bg_path" />
                             
                              <v-btn
                                class="btn-overlay"
                                icon
                                @click="overlayBg = false"
                              >
                              <v-icon  dark>
                                fa-xmark
                              </v-icon>
                              </v-btn>
                            </v-overlay>
                          </div>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" md="6">
                          <v-file-input
                            v-if="!btn_path"
                            id="file"
                            accept="image/png, image/jpeg"
                            prepend-icon="mdi-camera"
                            label="เเนบรูปปุ่มลงนาม"
                            v-model="editedItem.files_btn"
                            :rules="rules.filesBtnRules" 
                            @change="onFileChange(editedItem.files_btn, 'btn')"
                          ></v-file-input>

                          <div v-if="btn_path">
                            <label for="bg_path">เเนบรูปปุ่มลงนาม</label>
                            <div class="d-flex flex-row align-center">
                              <div class="preview" @click="overlayBtn = !overlayBtn">
                                <img :src="btn_path"/>
                              </div>  
                              <v-btn
                                class="mx-2 remove-icon"
                                fab
                                dark
                                x-small
                                color="pink"
                                @click="removePreview('btn')"
                              >
                                <v-icon dark>
                                  fa-xmark
                                </v-icon>
                              </v-btn>
                              <span class="text-img">ขนาดไม่เกิน 185px * 60px</span>
                            </div>
                           
                            <v-overlay class="style-bg" :opacity="opacity"  :z-index="zIndex" :value="overlayBtn">
                              <img :src="btn_path" />
                             
                              <v-btn
                                class="btn-overlay"
                                icon
                                @click="overlayBtn = false"
                              >
                              <v-icon  dark>
                                fa-xmark
                              </v-icon>
                              </v-btn>
                            </v-overlay>
                          </div>
                        </v-col>

                        <v-col cols="12" md="6">
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
                  class="btn btn-submit"
                  text
                  @click="submit"
              >
                  บันทึก
              </v-btn>
              <v-btn v-if="editedIndex > -1" color="error" @click="deleteItem(editedItem)"><i class="fa-solid fa-trash-can mr-1"></i>ลบ</v-btn>
              <v-btn
                  class="btn btn-cancel"
                  text
                  @click="close"
              >
                  ยกเลิก
              </v-btn>
              </v-card-actions>
          </v-card>

        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.number`]="{index}">{{index + 1}}</template>
    <template v-slot:[`item.start_date`]="{ item }">{{getThaiDate(item.start_date)}}</template>
    <template v-slot:[`item.end_date`]="{ item }">{{getThaiDate(item.end_date)}}</template>
    <template v-slot:[`item.start_time`]="{ item }">{{timeFormat(item.start_date)}}</template>
    <template v-slot:[`item.end_time`]="{ item }">{{timeFormat(item.end_date)}}</template>
    <template v-slot:[`item.create_date`]="{ item }">{{getThaiDate(item.create_date)}}</template>
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

</template>
<script>
  import  axios  from "axios";
  import moment from 'moment';
  import Swal from 'sweetalert2';
  import store from '../../store/index.js';
  export default {
  components: { },
    data: () => ({
      overlayImg: false,
      overlayBg: false,
      overlayBtn: false,
      absolute: false,
      zIndex: 1,
      opacity: 1,
      dialog: false,
      editedIndex: -1,
      valid: true,
      // currPic: null,
      userId: store.getters.user.id,
      headers: [
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'number',
        },
        { text: 'ชื่อเทศกาล', value: 'name' },
        { text: 'วันที่เริ่มต้น', value: 'start_date' },
        { text: 'วันที่สิ้นสุด', value: 'end_date' },
        { text: 'ตั้งเเต่เวลา', value: 'start_time' },
        { text: 'ถึงเวลา', value: 'end_time' },
        { text: 'วันที่สร้าง', value: 'create_date' },
        { text: 'สถานะ', value: 'status', align: 'center' },
        { text: 'Preview', value: 'preview', align: 'center', sortable: false },
        { text: 'Actions', value: 'actions', align: 'center', sortable: false },
      ],
      search: '',
      checkbox: false,
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
      files: null,
      files_bg: null,
      files_btn: null,
      color: '#1976D2FF',
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      color_menu: false,
      img_path : null,
      bg_path : null,
      btn_path : null,
      checkFileImg: false,
      checkFileBg: false,
      checkFileBtn: false,
      datas: [],
      check_datas: [],
      editedItem: {},
      defaultItem: {},
      nameRules: [v => !!v || 'กรุณาใส่ข้อมูล'],
      startRules: [v => !!v || "กรุณาใส่ข้อมูล"],
      endRules: [v => !!v || "กรุณาใส่ข้อมูล"],
      rules:{
        filesRules: [
          v => !!v || 'กรุณาใส่ข้อมูล (ขนาดไม่เกิน 700px * 600px)',
          v => (v && v.size > 0) || 'File is required',
        ],
        filesBgRules: [
          v => !!v || 'กรุณาใส่ข้อมูล (ขนาดไม่เกิน 900px * 900px)',
          v => (v && v.size > 0) || 'File is required',
        ],
        filesBtnRules: [
          v => !!v || 'กรุณาใส่ข้อมูล (ขนาดไม่เกิน 185px * 60px)',
          v => (v && v.size > 0) || 'File is required',
        ],

      },
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
      swatchStyle() {
        const { color, color_menu } = this
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
      // openDialog(idx) {
      //   this.currPic = this.img_path[idx]
      //   return this.showDialog = true
      // },

      onFileChange(payload, type) {
        const file = payload // in case vuetify file input
        switch(type) {
          case 'img':
            if (file) {
              this.checkFileImg = true
              this.img_path = URL.createObjectURL(file);
              console.log(this.img_path);
              URL.revokeObjectURL(file); // free memory

            } else {
              this.img_path =  null
            }  
          break;
          case 'bg':
              if (file) {
                this.checkFileBg = true
                this.bg_path = URL.createObjectURL(file);
                URL.revokeObjectURL(file); // free memory
                console.log(this.bg_path);
             
              } else {
                this.bg_path =  null
              }
          break;
          case 'btn':
             if (file) {
                this.checkFileBtn = true
                this.btn_path = URL.createObjectURL(file);
                URL.revokeObjectURL(file); // free memoryeditedItem
                console.log(this.btn_path);
              } else {
                this.btn_path =  null
              }
          break;
          default:
        }
      },

      removePreview(type){
        switch(type) {
          case 'img':
            this.img_path =  null
            this.editedItem.files = null
            this.checkFileImg = false
        
          break;
          case 'bg':
            this.bg_path =  null
            this.editedItem.files_bg = null
            this.checkFileBg = false
          break;
          case 'btn':
            this.btn_path =  null
            this.editedItem.files_btn = null
            this.checkFileBtn = false
          break;
          default:
        }
      },  
    
      previewItem(v){
        const routeData = this.$router.resolve({
          name: "festivalPreview",
          params: { id: v },
        });
        window.open(routeData.href, "_blank");


      },

      splitFile(v, type){
        const arr_file      = v.name.split(".");
        const filename      = `${type+this.editedItem.id+'.'+arr_file[1]}`  
        return filename
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

      close () {
        this.dialog = false
        this.checkFileImg = false
        this.checkFileBg  = false
        this.checkFileBtn = false
        if(this.editedIndex === -1){
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            
          })
        }else{
          this.color        = '#1976D2FF'
          this.img_path     = null
          this.bg_path      = null
          this.btn_path     = null
        }

      },
   
      create (){
        this.$nextTick(() => {
            this.editedItem   = Object.assign({}, this.defaultItem)
            this.dialog      = true
            this.editedIndex  = -1
        })
      },

      async getFestival () {
        try {
          let path = await `/api/getFestival`
          let response = await axios.get(`${path}`)
          this.datas = await response.data.data
          await this.checkState()

        } catch (error) {
             console.log('error :' + error)
        }
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

      async myUpload(path, file_name, files){


        let fd2 =  new FormData();
        await fd2.append('image_name', file_name);
        await fd2.append('images', files);

        // let path = await `/api/uploadFile`
        let res2  = await axios.post(`/api/${path}`, fd2)
        console.log(res2);

      },
      
      async submit () {  

        console.log('==================');
        


        if(this.$refs.form.validate()){
       
          // แก้ไข
          if(this.editedIndex > -1){

            console.log('edit');

            if(this.checkFileImg){
              var filename = await this.splitFile(this.editedItem.files, 'imgfid_')
            }

            if(this.checkFileBg){
              var filename2 = await this.splitFile(this.editedItem.files_bg, 'bgfid_')
            }

            if(this.checkFileBtn){
              var filename3 = await this.splitFile(this.editedItem.files_btn, 'btnfid_')
            }


            let fd_edit = await {
              "fid"           : this.editedItem.id,
              "user_id"       : this.userId,
              "name"          : this.editedItem.name,
              "color"         : this.color,
              "start_date"    : `${moment(this.editedItem.start_date).format('YYYY-MM-DD') + ' ' + this.editedItem.start_time}`,
              "end_date"      : `${moment(this.editedItem.end_date).format('YYYY-MM-DD') + ' ' + this.editedItem.end_time}`,
              "file_name"     : this.editedItem.files ? filename : this.editedItem.file_name,
              "file_bg_name"  : this.editedItem.files_bg ? filename2 : this.editedItem.file_bg_name,
              "file_btn_name"  : this.editedItem.files_btn ? filename3 : this.editedItem.file_btn_name,
              "status"        : this.editedItem.status
            }


            try {
              let path = await `/api/updateFestival`
              let res = await axios.post(`${path}`, fd_edit)

              if(res){


                if(this.checkFileImg){

                  // รูปภาพ

                  let fd2 =  new FormData()
                  await fd2.append('image_name', filename)
                  await fd2.append('images', this.editedItem.files)

                  let path2 = await `/api/uploadFile`
                  let res2 = await axios.post(`${path2}`, fd2)
                  console.log(res2);

                }

                if(this.checkFileBg){
                  // พื้นหลัง
                  let fd3 = new FormData();
                  await fd3.append('image_name', filename2);
                  await fd3.append('images', this.editedItem.files_bg);
              
                  let path3 = await `/api/uploadFileBg`
                  let res3  = await axios.post(`${path3}`, fd3)
                  console.log(res3);
                }

                if(this.checkFileBtn){
                  // ปุ่มลงนาม
                  let fd4 = new FormData();
                  await fd4.append('image_name', filename3);
                  await fd4.append('images', this.editedItem.files_btn);
              
                  let path4 = await `/api/uploadFileBtn`
                  let res4  = await axios.post(`${path4}`, fd4)
                  console.log(res4);
                }
              }
              Swal.fire({
                  icon: 'success',
                  title: 'บันทึกสำเร็จ',
                  text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว' 
              })
              this.dialog = await false

              await this.getFestival()
              await this.$store.dispatch('checkFestival')


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
              "status"        : this.editedItem.status ? this.editedItem.status : 0
            }


            try {

             
              let path = await `/api/createFestival`
              let res = await axios.post(`${path}`, fd)

                if(res){

                  // รูปภาพ

                  await this.myUpload('uploadFile',res.data.file_img, this.editedItem.files);

                  await this.myUpload('uploadFileBg',res.data.file_bg, this.editedItem.files_bg);

                  await this.myUpload('uploadFileBtn',res.data.file_btn, this.editedItem.files_btn);



                  // let fd2 =  new FormData();
                  // await fd2.append('image_name', res.data.file_img);
                  // await fd2.append('images', this.editedItem.files);

                  // let path2 = await `/api/uploadFile`
                  // let res2  = await axios.post(`${path2}`, fd2)
                  // console.log(res2);

                  // พื้นหลัง
                  // let fd3 = new FormData();
                  // await fd3.append('image_name', res.data.file_bg);
                  // await fd3.append('images', this.editedItem.files_bg);

                  // let path3 = await `/api/uploadFileBg`
                  // let res3  = await axios.post(`${path3}`, fd3)
                  // console.log(res3);

                  // ปุ่มลงนาม
                  // let fd4 = new FormData();
                  // await fd4.append('image_name', res.data.file_btn);
                  // await fd4.append('images', this.editedItem.files_btn);

                  // let path4 = await `/api/uploadFileBtn`
                  // let res4  = await axios.post(`${path4}`, fd4)
                  // console.log(res4);


                }
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ',
                    text: 'ระบบได้ทำการบันทึกข้อมูลของคุณแล้ว'
                }).then( function(){
                });
                this.dialog   = false
                this.img_path = null
                this.bg_path  = null
                this.btn_path = null
                this.color    = '#1976D2FF'
                await this.getFestival()
                // await this.$store.dispatch('checkFestival')
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

    

      deleteItem (item) {
        Swal.fire({
            title: 'คำเตือน',
            text: "คุณต้องการลบข้อมูลเทศกาลใช่หรือไม่ ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
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
                        text: 'ลบข้อมูลพนักงานสำเร็จ',
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
    .preview{
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
    }

    .v-input--checkbox .v-input__slot{
      margin-bottom: 0px!important;
    }
    .v-input--checkbox .v-messages{
      min-height: inherit!important;
    }
   

</style>
