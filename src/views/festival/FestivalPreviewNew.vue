<template>
 
  <div class="full-page">
    <div 
      v-if="item.file_bg_name"
      class="bg-page text-center"  
      :style="{ 'background-image': 'url(' + avatar_url + ')' }"
    >
      <div v-if="!check" class="next" >
        <div class="box-display" @click="check = true" > <i class="fa-solid fa-arrow-right style-arrow"></i>ถัดไป</div>
      </div>
      <div v-if="check" class="back">
        <span class="box-display"  @click="check = false" ><i class="fa-solid fa-arrow-left style-arrow"></i>ย้อนกลับ</span>
      </div>
      <v-container>
        <div class="page">
          <div class="image">
            <img v-if="item.file_name" class="w-100" :src="image_path" alt="image"/>
          </div>
          <v-form v-if="!check"
            ref="form" 
            class="sign-form"
          >
            <v-text-field
              v-model="datas.p_name"
              :rules="nameRules"
              label="ชื่อ"
              required
              thai_engLanguage
              maxlength="30"
            ></v-text-field>

            <v-text-field
              v-model="datas.p_lastname"
              :rules="lastnameRules"
              label="นามสกุล"
              required
              thai_engLanguage
              maxlength="30"
            ></v-text-field>
            <div class="box-submit text-center">
                <img :src="button_path"  @click="previewSubmit"/>
            </div>
          </v-form>
          <div v-if="check" class="box-detail">
            <h2 class="style-title" :style="{'color': item.color}">ด้วยเกล้าด้วยกระหม่อมขอเดชะ ข้าพระพุทธเจ้า</h2> 
            <div class="style-xs">
              <h2>ด้วยเกล้าด้วยกระหม่อมขอเดชะ</h2> 
              <h2>ข้าพระพุทธเจ้า</h2> 
            </div>
            <h3 v-if="datas.p_name" class="style-name" :style="{'color': item.color}">{{datas.p_name}} {{datas.p_lastname}}</h3> 
            <h3 v-else class="style-name" :style="{'color': item.color}">ชื่อ - สกุล</h3> 
            <p class="style-number" :style="{'color': item.color}">ผู้ร่วมลงนามลำดับที่ : 1</p>
            <div class="box-footer">
              <a href="https://www.cgd.go.th/">
                <v-btn
                    rounded
                    large
                    class="btn btn-home"
                    :style="{'background-color': item.color}"
                    >
                    กลับหน้าหลัก
                </v-btn>
              </a>
              <v-btn
                rounded
                large
                class="btn btn-print"
                @click="printDivContent"
                :style="{'border': '1px solid ' + item.color}"
                >
                <span  :style="{'color': item.color}"> พิมพ์คำถวายพระพร</span>
              </v-btn>    
            </div>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>
<script>
    import  axios  from "axios";
export default {
  data: () => ({
    check: false,
    item: {},
    datas: {
      p_name: '',
      p_lastname: '',
    },  
    image_path: "",
    background_path: "",
    button_path: "",
    nameRules: [
      v => !!v || 'กรุณากรอกข้อมูล',
      v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
    ],
    lastnameRules: [
      v => !!v || 'กรุณากรอกข้อมูล',
      v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
    ],
  }),
  mounted(){
    this.getFestivalPreview()
  },
  computed: {
    avatar_url : function(){
      return  this.background_path
    }

  },
  
  methods:{
    previewSubmit(){
      if(this.$refs.form.validate()){
        this.check = !this.check
      }
    },
    printDivContent () {
      window.print()
    },
    async getImgPath(){
      let path = await `/api/getImageFestival?filename=${this.item.file_name}`
      let res = await axios.get(`${path}`)
      this.image_path = await res.data
      
    },
    async getBgPath(){
      let path = await `/api/getImageFestival?filename=${this.item.file_bg_name}`
      let res = await axios.get(`${path}`)
      this.background_path = await res.data
      
    },
    async getBtnPath(){
      let path = await `/api/getImageFestival?filename=${this.item.file_btn_name}`
      let res = await axios.get(`${path}`)
      this.button_path = await res.data
      
    },
    
    async getFestivalPreview(){
        let path = await `/api/getFestivalPreview/${this.$route.params.id}`
        let response = await axios.get(`${path}`)
        this.item = await response.data.data[0]
        await this.getImgPath()
        await this.getBgPath()
        await this.getBtnPath()
    },
  }

}
</script>

<style>
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
  .style-arrow{
    padding: 0.5rem;
    border-radius: 50%;
    background: #213862;
    color: white;
    margin-right: 0.5rem;
  }
  .next{
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 5rem;
    margin-top: 2rem;
    cursor: pointer;
  }
  .back{
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 5rem;
    margin-top: 2rem;
    cursor: pointer;
  }
  .back .arrow-left{
    padding: 0.5rem;
    border-radius: 50%;
    background: #213862;
    color: white;
  }
  .box-display{
    display: flex !important;
    justify-content: center;
    align-items: center;
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
  @media only screen and (max-width: 600px) {
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