<template>
  <div class="full-page">
    <div 
      v-if="data.file_bg_name"
      class="bg-page text-center"  
      :style="{ 'background-image': 'url(' + avatar_url + ')' }"
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
                  maxlength="30"
              ></v-text-field>

                  <v-text-field
                  v-model="p_lastname"
                  :rules="lastnameRules"
                  label="นามสกุล"
                  required
                  thai_engLanguage
                  maxlength="30"
              ></v-text-field>
          
              <div class="box-submit text-center">
              <img :src="button_path"   @click="submit"/>
              </div>
            </v-form>
              <div v-if="checkSubmit" class="box-detail">
                <h2 class="style-title" :style="{'color': data.color}">ด้วยเกล้าด้วยกระหม่อมขอเดชะ ข้าพระพุทธเจ้า</h2> 
                <div class="style-xs">
                  <h2>ด้วยเกล้าด้วยกระหม่อมขอเดชะ</h2> 
                  <h2>ข้าพระพุทธเจ้า</h2> 
                </div>
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
  import moment from 'moment'
  import  axios  from "axios";
  export default {
    name: 'festivalForm',
    data: () => ({
        valid: true,
        checkSubmit: false,
        p_name: '',
        nameRules: [
        v => !!v || 'กรุณากรอกข้อมูล',
        v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
        ],
        p_lastname: '',
        lastname: '',
        lastnameRules: [
        v => !!v || 'กรุณากรอกข้อมูล',
        v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
        ],
        p_festival: 'forqueen',
        regis_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        browser: '',
        device: '',
        item: {},
        count: '',
        data: [],
        image_path: "",
        button_path: "",
        background_path: "",
    }),
    computed: {
        avatar_url : function(){
          return this.background_path
          // return axios.defaults.baseURL+'/uploads/' 
      }
    },
    created(){
      this.getDeviceType();
      this.getBrowserDetect();
  
    },
    mounted(){
      this.getFestivalSign()
    },
    methods: {
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
            "id_festival" : this.data.id,
            "name"        : this.p_name,
            "lastname"    : this.p_lastname,
            "p_festival"  : this.p_festival,
            "regis_date"  : this.regis_date,
            "browser"     : this.browser,
            "device"      : this.device,
          }
          try {
            let path      = await `/api/createFestivalSign`
            let response  = await axios.post(`${path}`, fd)
            this.item     = response.data.data[0]
            this.count    = response.data.counter

          } catch (error) {
            console.log('error :' + error)
          }
        }
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
      printDivContent () {
        window.print()
      },
    }
  }
</script>

<style scoped>
  .bg-page{
    text-align: center;
    height: auto;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .sign-form{
      max-width: 700px;
      display: inline-block;
      padding: 1rem;
      width: 100%;
      text-align: left;
  }
  .box-submit{
      width: 185px;
      height: 60px;
      margin: auto;
  }
  .box-submit img {
    cursor: pointer;
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  .btn{
    display: inline-block;
  }
  .btn-home{
    color: white;
    margin-right: 0.5rem;
    font-weight: 300;
  }
   .btn-print{
    background-color: white!important;
    color: #0099dc;
    font-weight: 400;
   
  }
  .style-title{
    font-weight: 400;
    margin: 2rem 0 1rem 0;
  }
  .style-xs{
    display: none;
  }
   .style-name{
   margin: 2rem 0 1rem 0;
   font-weight: 400;
  }
  .style-number{
    font-size: 20px;
  }
   .box-footer{
    margin: 2rem 0;
  }
  .image{
    width: 700px!important;
    height: 600px!important;
    display: inline-block;
  }
  .image .w-100{
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  @media only screen and (max-width: 600px) {
    .image .w-100{
      width: 100%;
    }
    .box-sign{
      position: relative;
      cursor: pointer;
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;
      text-align: center;
    }
    .style-title{
     display: none;
    }
    .style-xs{
      display: block;
      color: #060a7c;
      margin: 2rem 0 1rem 0;
    }
    .style-xs h2{
     font-weight: 400;
    }
    /* .btn-print{
      display: none;
    } */
  }
  @media only screen and (max-width: 960px) {
    .btn-print{
      display: none;
    }
  }
   @media print {
    .box-footer{
      display: none;
    }
  }

</style>