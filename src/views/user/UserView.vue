<template>
    <v-data-table
        :headers="headers"
        :items="datas_user"
        sort-by="calories"
        class="elevation-1"
    >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>รายการบุคลากร</v-toolbar-title>

        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
          <!-- <template v-slot:activator="{ attrs }"> -->
            <v-btn
              class="mb-2 btn-create"
              @click="create"
            >
              สร้าง
            </v-btn>
          <!-- </template> -->
      </v-toolbar>
    </template>
    <template v-slot:[`item.create_date`]="{ item }">{{getThaiDate(item.create_date)}}</template>
    <template v-slot:[`item.name`]="{ item }">{{item.name + ' ' + item.lastname}}</template>
    <template v-slot:[`item.status`]="{ item }">{{item.status == 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}}</template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
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
      headers: [
        // {
        //   text: 'ลำดับ',
        //   align: 'start',
        //   sortable: false,
        //   value: 'number',
        // },
        { text: 'วันที่จัดสร้าง', value: 'create_date' },
        { text: 'ชื่อ-สกุล', value: 'name' },
        { text: 'ตำเเหน่ง', value: 'position' },

        { text: 'ระดับการใช้งาน', value: 'roles' },
        { text: 'สถานะ', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      datas_user: [],
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
          console.log(this.datas_user);

        } catch (error) {
          console.log('error :' + error)
        }
      },
       create(){
        this.$router.push({ name: 'userForm', params: { title: 'create' } })
      },
      editItem (item) {
        this.$router.push({ name: 'userFormEdit', params: { id: item.id } })
      }
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