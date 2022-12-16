<template>
  <div class="full-page">
    <div 
      v-if="data.file_bg_name"
      class="bg-page text-center"  
      :style="{ 'background-image': 'url(' + background_path + ')' }"
    >
    <v-container>
      <div class="page">
        <div class="image">
          <img v-if="data.file_name" class="w-100" :src="image_path" />
        </div>
        <v-form 
          ref="form" 
          lazy-validation 
          v-if="!checkSubmit"  
          v-model="valid"
          class="sign-form"
        >
          <v-text-field
            v-model="p_name"
            :rules="nameRules"
            label="ชื่อ"
            required
            thai_engLanguage
          ></v-text-field>
          <v-text-field
            v-model="p_lastname"
            :rules="lastnameRules"
            label="นามสกุล"
            required
            thai_engLanguage
          ></v-text-field>
          <div v-if="data.status_reference == 1" class=" mt-3 text-center">
            <div v-if="get_reference.name" class="d-flex justify-space-between">
              <p >{{get_reference.name}}</p>
              <span class="cursor-pointer"  @click="editSelectReference">  
                <i class="fa-solid fa-pen-to-square"></i>
              </span>
            </div>
    
            <select-reference v-else ref="nameReference" :festival_id="data.id" :color="data.color" @change_reference="change_reference"/>

          </div>  
          <div class="box-submit mt-5 text-center">
            <img :src="button_path"   @click="submit"/>
          </div>
        </v-form>
        <div v-if="checkSubmit" class="box-detail">
          <h2 class="style-title" :style="{'color': data.color}">ด้วยเกล้าด้วยกระหม่อมขอเดชะ ข้าพระพุทธเจ้า</h2> 
          <div class="style-xs">
            <h2>ด้วยเกล้าด้วยกระหม่อมขอเดชะ</h2> 
            <h2>ข้าพระพุทธเจ้า</h2> 
          </div>
          <h2 class="style-reference" :style="{'color': data.color}">{{item.name_reference}}</h2> 
          <h3 class="style-name" :style="{'color': data.color}">{{item.name}} {{item.lastname}}</h3> 
          <p class="style-number" :style="{'color': data.color}">ผู้ร่วมลงนามลำดับที่ : {{count}}</p>
          <div class="box-footer">
              <a href="https://www.cgd.go.th/">
                <v-btn
                  rounded
                  large
                  class="btn btn-home"
                  :style="{'background-color': data.color}"
                  >
                  กลับหน้าหลัก
                </v-btn>
              </a>
              <v-btn
                rounded
                large
                class="btn btn-print"
                @click="printDivContent"
                :style="{'border': '1px solid ' + data.color}"
              >
              <span  :style="{'color': data.color}"> พิมพ์คำถวายพระพร</span>
            </v-btn>    
          </div>
        </div>
      </div>
    </v-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from 'moment';
import selectReference from '@/components/dialog/selectReference.vue';
export default {
  name: 'festivalForm',
  components: { selectReference },
  data:() => ({
    valid: true,
    checkSubmit: false,
    p_name: '',
    p_lastname: '',
    p_festival: 'forqueen',
    image_path: "",
    button_path: "",
    background_path: "",
    browser: '',
    device: '',
    regis_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    nameRules: [
      v => !!v || 'กรุณากรอกข้อมูล',
      v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
      v => ( v && v.length <= 50 ) || "ห้ามใส่ข้อมูลเกิน 50 ตัวอักษร",
    ],
    lastnameRules: [
      v => !!v || 'กรุณากรอกข้อมูล',
      v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`,
      v => ( v && v.length <= 50 ) || "ห้ามใส่ข้อมูลเกิน 50 ตัวอักษร",
    ],
    count: '',
    item: {},
    data: [],
    get_reference : [],
  }),
  metaInfo() {
    return {
        meta: [
            { name: 'description', content: this.data.detail},
            { property: 'og:description', content: this.data.detail},

        ]
    }
  },
  created(){
    this.getDeviceType();
    this.getBrowserDetect();
  },
  mounted(){
    this.getFestivalSign();
  },
  methods:{
    printDivContent () {
      window.print()
    },
    change_reference(v){
      this.get_reference = v
    },
    editSelectReference(){
      this.get_reference = ''
    },
    getDeviceType(){
      let ua = navigator.userAgent;
      let deviceName;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        deviceName = "tablet";
      }else if( /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)){
        deviceName = "mobile";
      }else{
        deviceName = "desktop";
      }
      this.device = deviceName  
    },
    getBrowserDetect(){        
      let userAgent = navigator.userAgent;
      let browserName;   
      if(userAgent.match(/chrome|chromium|crios/i)){
        browserName = "chrome";
      }else if(userAgent.match(/firefox|fxios/i)){
        browserName = "firefox";
      } else if(userAgent.match(/safari/i)){
        browserName = "safari";
      }else if(userAgent.match(/opr\//i)){
        browserName = "opera";
      } else if(userAgent.match(/edg/i)){
        browserName = "edge";
      }else{
        browserName="No browser detection";
      }
      this.browser = browserName
    },
    async getImgPath(){
      let path = await `/api/getImageFestival?filename=${this.data.file_name}`
      let res = await axios.get(`${path}`)
      this.image_path = await res.data
    },
    async getBgPath(){
      let path = await `/api/getImageFestival?filename=${this.data.file_bg_name}`
      let res = await axios.get(`${path}`)
      this.background_path = await res.data
    },
    async getBtnPath(){
      let path = await `/api/getImageFestival?filename=${this.data.file_btn_name}`
      let res = await axios.get(`${path}`)
      this.button_path = await res.data
    },
    async getFestivalSign () {
      try {
        let path      = await `/api/getFestivalSign`
        let response  = await axios.get(`${path}`)
        console.log(response);
        this.data     = await response.data.data[0]
        
        await this.getImgPath()
        await this.getBgPath()
        await this.getBtnPath()
      } catch (error) {
          console.log('error :' + error)
      }
    },
    async submit (){
      if(this.$refs.form.validate()){
        this.checkSubmit = true
        let fd = {
          "id_festival"     : this.data.id,
          "name"            : this.p_name,
          "lastname"        : this.p_lastname,
          "p_festival"      : this.p_festival,
          "regis_date"      : this.regis_date,
          "browser"         : this.browser,
          "device"          : this.device,
          "id_reference"    : this.get_reference.id,
          "name_reference"  : this.get_reference.name
        }
        try {
          let path      = await `/api/createFestivalSign`
          let response  = await axios.post(`${path}`, fd)
          this.item     = response.data.data[0]

          console.log(this.item );
          this.count    = response.data.counter

        } catch (error) {
          console.log('error :' + error)
        }
      }
    },
  }
}
</script>

<style>

</style>