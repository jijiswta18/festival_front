<template>
    <div class="full-page">
        <div 
        v-if="item.file_bg_name"
        class="bg-page text-center"  
        :style="{ 'background-image': 'url(' + avatar_url + item.file_bg_name + ')' }"
        >
        <div v-if="!check_preview" class="next" >
          <div class="box-display" @click="previewNext(true)" > <i class="fa-solid fa-arrow-right style-arrow"></i>ถัดไป</div>
        </div>
        <div v-if="check_preview" class="back">
          <span class="box-display" @click="previewBack(false)" ><i class="fa-solid fa-arrow-left style-arrow"></i>ย้อนกลับ</span>
        </div>
        <v-container>
            <div class="page">
                <div class="image">
                <img v-if="item.file_name" class="w-100" :src="avatar_url+item.file_name" />
                </div>
                <v-form v-if="!check_preview"
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
                        <img :src="avatar_url + item.file_btn_name"  @click="previewSubmit"/>
                    </div>
                </v-form>
                <div v-if="check_preview" class="box-detail">
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
        data:() => ({
            item: [],
            check_preview : false,
            datas: {
              p_name: '',
              p_lastname: '',
            },  
            nameRules: [
              v => !!v || 'กรุณากรอกข้อมูล',
              v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
            ],
            lastnameRules: [
              v => !!v || 'กรุณากรอกข้อมูล',
              v =>/^[a-zA-Zก-ฮะ-์\s]+$/.test(v) ||` ห้ามกรอกอักขระพิเศษ เเละตัวเลข`
            ],
        }),
        created(){
            this.getFestivalPreview()
        },
        computed: {
            avatar_url : function(){
                return axios.defaults.baseURL+'/uploads/' 
            }
        },
        methods:{
          previewNext(v){
            this.check_preview = v
          },
          previewBack(v){
            this.check_preview = v
          },
          previewSubmit(){
            if(this.$refs.form.validate()){
              this.check_preview = !this.check_preview
            }
          },
          printDivContent () {
              window.print()
          },
          async getFestivalPreview(){
              let path = await `/api/getFestivalPreview`
              let response = await axios.get(`${path}/`+this.$route.params.id)
              this.item = response.data.data[0]
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
  .box-submit img {
      cursor: pointer;
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
    .box-display{
        display: flex !important;
        justify-content: center;
        align-items: center;
    }

  .next{
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 5rem;
    margin-top: 2rem;
    cursor: pointer;
  }
  .style-arrow{
    padding: 0.5rem;
    border-radius: 50%;
    background: #213862;
    color: white;
    margin-right: 0.5rem;

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
  .image{
    max-width: 700px!important;
    max-height: 600px!important;
    display: inline-block;
  }
  .image .w-100{
    width: 100%;
  }
  
  @media only screen and (max-width: 600px) {
    /* .image .w-100{
      max-width: 700px!important;
      max-height: 600px!important;
    } */
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