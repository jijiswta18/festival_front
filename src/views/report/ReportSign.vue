<template>

    <v-data-table
        :headers="headers"
        :items="datas"
        :search="search"
        :loading="loadTable"
        loading-text="Loading..."
        sort-by="calories"
        class="elevation-1"
    >
   
        <template v-slot:top>
            <v-toolbar flat class="table-head">
                <v-toolbar-title class="mr-2">ระบบลงนามถวายพระพร</v-toolbar-title>
                <v-btn
                    depressed
                    color="success mb"
                >
                
                    <vue-excel-xlsx
                        class="btn btn-default "
                        :data="export_datas"
                        :columns="columns"
                        :file-name="'festival'"
                        :file-type="'xlsx'"
                        :sheet-name="'festival'"
                        >
                        <i class="fa-solid fa-file-export icon-style"></i>
                        Export
    
                </vue-excel-xlsx>
                </v-btn>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="ค้นหา (ชื่อ-สกุล, Browser, Device)"
                    single-line
                    hide-details
                ></v-text-field>
            </v-toolbar>
        </template>
        <template v-slot:[`item.number`]="{index}">{{index + 1}}</template>
        
        <template v-slot:[`item.name`]="{ item }">{{item.name + ' ' + item.lastname}}</template>
        <template v-slot:[`item.regis_date`]="{ item }">{{getThaiDate(item.regis_date)}}</template>
    </v-data-table>
</template>

<script>
import  axios  from "axios";
export default {
    data () {
      return {
        search: '',
        loadTable: true,
        headers: [
          {
              text: '',
              align: 'start',
              filterable: false,
              value: 'number',
          },
          { text: 'ชื่อ-สกุล', value: 'name' },
          { text: 'Browser', value: 'browser' },
          { text: 'Device', value: 'device' },
          { text: 'วันที่ลงนาม', value: 'regis_date' },
        ],
        datas: [],
        export_datas: [],
        columns : [
            {
                label: "ชื่อ-สกุล",
                field: "name",
                
            },
            {
                label: "Browser",
                field: "browser",
            },
            {
                label: "Device",
                field: "device",
            },
            {
                label: "วันที่ลงนาม",
                field: "regis_date",
                // dataFormat: this.getThaiDate
            },
            {
                label: "IP",
                field: "ip_user",
            },

        ],
 
      }
    },
    mounted(){
        this.getDetail()
        // this.getNameFestival()
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
        async getDetail () {
            try {
                let path = await `/api/export_ffuagvylst`
                let response = await axios.get(`${path}/`+this.$route.params.id)
                this.datas = await response.data.data
                
                response.data.data.forEach(item => {
                    this.export_datas.push({ 
                        'name'      : item.name + ' ' + item.lastname,
                        'browser'   : item.browser,
                        'device'    : item.device,
                        'regis_date': this.getThaiDate(item.regis_date),
                        'IP'        : item.ip_user
                    })
                })
                this.loadTable = await false;
            
            } catch (error) {
                console.log('error :' + error)
            }
        },

        // async getNameFestival(){
        //     try {
        //         let path = await `/api/getNameFestival`
        //         let response = await axios.get(`${path}/`+this.$route.params.id)
        //         this.filename = await response.data.data[0].name_festival
        //         console.log(response);
        //     } catch (error) {
        //         console.log('error :' + error)
        //     }
        // }
    }

}
</script>

<style scoped>
    .text-name{
        color: #0170c2;
    }
</style>