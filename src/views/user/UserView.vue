<template>
  <v-data-table
      :headers="headers"
      :items="check_datas"
      :search="search"
      sort-by="calories"
      class="elevation-1"
  >
  <template v-slot:top>
    <v-toolbar flat class="table-head">
      <v-toolbar-title class="mr-2">รายการบุคลากร</v-toolbar-title>
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
        @click="checkState(datas_user)"
      ></v-checkbox>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <!-- <v-select
        v-model="state"
        :items="selectState"
        item-text="value"
        item-value="id"
        v-on:change="changeRoute(datas_user)"
      ></v-select> -->
    </v-toolbar>
  </template>
  <template v-slot:[`item.number`]="{index}">{{index + 1}}</template>
  <template v-slot:[`item.create_date`]="{ item }">{{getThaiDate(item.create_date)}}</template>
  <template v-slot:[`item.name`]="{ item }">{{item.name + ' ' + item.lastname}}</template>
  <template v-slot:[`item.roles`]="{ item }">{{item.roles == 'admin' ? 'ผู้ดูเเลระบบ' : 'ผู้ใช้งานระดับสูง'}}</template>
  <template v-slot:[`item.status`]="{ item }"><span :class="item.status == 0 ?'red--text':''">{{item.status == 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}}</span></template>
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
</template>
<script>
    import  axios  from "axios";
    // import moment from 'moment';
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      search: '',
      headers: [
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'number',
        },
        { text: 'วันที่สร้าง', value: 'create_date', align: 'center'},
        { text: 'ชื่อ-สกุล', value: 'name' },
        { text: 'ตำเเหน่ง', value: 'position' },

        { text: 'ระดับการใช้งาน', value: 'roles', align: 'center'},
        { text: 'สถานะ', value: 'status', align: 'center'},
        { text: 'Actions', value: 'actions', align: 'center', sortable: false },
      ],
      datas_user: [],
      checkbox: false,
      check_datas : [],
    }),

    created () {
      this.getUser()
    },
    
    methods: {
      getThaiDate(item){
        if (item){
          var d = new Date(item);
          return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        }else{
          return "";
        }            
      },
      async getUser () {
        try {
          let path        = await `/api/getUser`
          let response    = await axios.get(`${path}`)
          this.datas_user = response.data.data

          this.checkState(this.datas_user)

        } catch (error) {
          // console.log('error :' + error)
        }
      },
      checkState(v){

        const datas = v
        if(!this.checkbox){
          const result = datas.filter(data => data.status == 1);
          this.check_datas = result
        }else{
          this.check_datas = this.datas_user
        }
  
      },
  
       create(){
        this.$router.push({ name: 'userForm', params: { title: 'create' } })
      },
      editItem (item) {
        this.$router.push({ name: 'userFormEdit', params: { id: item.id } })
      },
      // changeRoute(v){
      //   console.log(this.state);
      //   var names = v.map(function(value){ return value.state })
      //   v.forEach(item => {
      //       this.selectState.push({'id':item.state,'value':item.value})
      //   })

      //   console.log(this.selectState);


 
      // }
      
    },
  }
</script>
<style scoped>
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
    .btn-submit{
        background-color: #0170c2;
        border: 1px solid #0170c2;
        color: white!important;
    }
    .btn-cancel{
        color: #0170c2!important;
        border: 1px solid #0170c2;
        margin-right: 0.5rem;
    }
</style>