<template>
    <!-- <div id="app" data-app> -->
    <v-data-table
        :headers="headers"
        :items="desserts"
        sort-by="calories"
        class="elevation-1"
    >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>รายการบุคลากร</v-toolbar-title>
        {{editedIndex}}
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ attrs }">
            <v-btn
              class="mb-2 btn-create"
              v-bind="attrs"
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
                <v-container>
                    <v-row>

                    <v-col
                        cols="12"
                    >
                        <label>ชื่อเทศกาล</label>
                        <input
                        type="text"
                        class="form-control form-control-solid form-control-lg"
                        name="address1"
                        placeholder="Address Line 1"
                        value="Address Line 1"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                    >
                        <label>เเนบรูปเทศกาล</label>
                        <b-form-file
                        v-model="file1"
                        :state="Boolean(file1)"
                        placeholder="Choose a file or drop it here..."
                        drop-placeholder="Drop file here..."
                        ></b-form-file>
                        <div class="mt-3">Selected file: {{ file1 ? file1.name : '' }}</div>
                    </v-col>
                    </v-row>
                </v-container>
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
                    @click="save"
                >
                    ตกลง
                </v-btn>
                </v-card-actions>
            </v-card>


        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
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
    <!-- <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template> -->
  </v-data-table>
    <!-- </div> -->
 
</template>
<script>
    import  axios  from "axios";
    import moment from 'moment';
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'ลำดับ',
          align: 'start',
          sortable: false,
          value: 'number',
        },
        { text: 'วันที่จัดทำ', value: 'create_date' },
        { text: 'ชื่อ-สกุล', value: 'name' },
        { text: 'ตำเเหน่ง', value: 'position' },

        { text: 'ระดับการใช้งาน', value: 'roles' },
        { text: 'สถานะ', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        register_date: '',
        name_festival: 0,
        create_by: 0,
        status: 0,
      },
      defaultItem: {
        register_date: '',
        name_festival: 0,
        create_by: 0,
        status: 0,
      },
       file1: null,
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'สร้างเทศกาล' : 'แก้ไขเทศกาล'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.getUser()
    },

    methods: {
      async getUser () {
        try {
          let path = await `/api/getUser`
          let response = await axios.get(`${path}`)
          console.log(response);
            response.data.data.forEach(item  => {
                this.desserts.push({ 
                    'id'          : item.id,
                    'number'      : item.id,
                    'name'        : item.name + ' ' + item.lastname,
                    'position'    : item.position,
                    'roles'       : item.roles,
                    'status'       :item.state == '1' ? 'ใช้งาน': 'ไม่ใช้งาน',
                    'create_date' : moment(item.create_date).format('DD-MM-YYYY'),
                })
            })
        } catch (error) {
             console.log('error :' + error)
          
        }
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.$router.push({ name: 'userFormEdit', params: { id: item.id } })
      },

      deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

    save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
      create(){
        this.$router.push({ name: 'userForm', params: { title: 'create' } })
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