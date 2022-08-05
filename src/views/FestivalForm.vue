<template>
    <div class="full-page">
        <div class="bg-page text-center">
            <v-container>
                <div class="page">
                  <pre>{{data}}</pre>
                    <div class="image">
                      <img v-if="data.file_name" class="w-100" :src="avatar_url+data.file_name" />
                      <img v-else class="w-100" src="@/assets/images/mockup.png" />
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
                      <img src="@/assets/images/banner01.gif"  @click="submit"/>
                      </div>
                    </v-form>
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
          // checkForm: false,
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
          item: {
          name: '',
          lastname: '',
          counter: '',
          // image_name : '',
          },
          data: [],
      }),
      computed: {
          avatar_url : function(){
            return axios.defaults.baseURL+'/uploads/' 
        }
      },
      created(){
        // this.getDeviceType();
        // this.getBrowserDetect();
    
      },
      mounted(){
        this.getFestivalSign()
      },
      methods: {
        async getFestivalSign () {
          try {
            let path = await `/api/getFestivalSign`
            let response = await axios.get(`${path}`)
            this.data = response.data.data[0]

            console.log( this.data);
          } catch (error) {
              console.log('error :' + error)
          }
        },
        async submit (){
          if(this.$refs.form.validate()){
            this.checkSubmit = true
            let fd = {
              "name" : this.p_name,
              "lastname" : this.p_lastname,
              "p_festival" : this.p_festival,
              "regis_date" : this.regis_date,
              "browser" : this.browser,
              "device" : this.device,
            }
            console.log(fd);
            const response = await axios.post('/api/createFestivalSign', fd) 
            console.log(response);
            // this.item.name = response.data.name
            // this.item.lastname = response.data.lastname
            // this.item.counter = response.data.counter
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

<style>
    .sign-form{
        max-width: 700px;
        display: inline-block;
        padding: 1rem;
        width: 100%;
        text-align: left;
    }
    .box-submit img {
        cursor: pointer;
    }
</style>