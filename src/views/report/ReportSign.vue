<template>
   <div>
        <!-- <div class="d-flex flex-row justify-space-between mb-3">
            <h2 class="text-name">ระบบลงนามถวายพระพร</h2>
        <v-btn
            depressed
            color="primary"
        >
            <vue-excel-xlsx
                class="btn btn-default "
                :data="datas"
                :columns="columns"
                :file-name="'festival'"
                :file-type="'xlsx'"
                :sheet-name="'festival'"
                >
                <i class="fa-solid fa-file-export"></i>
                Export
            </vue-excel-xlsx>
        </v-btn>
        </div> -->
        <!-- <v-card> -->
            <!-- <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title> -->
            <v-data-table
                :headers="headers"
                :items="datas"
                :search="search"
                sort-by="calories"
                class="elevation-1"
            >
            <template v-slot:top>
                <v-toolbar flat>
                <v-toolbar-title>ระบบลงนามถวายพระพร</v-toolbar-title>
                <v-btn
                    depressed
                    color="success ml-2"
                >
                    <vue-excel-xlsx
                        class="btn btn-default "
                        :data="datas"
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
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                    </v-toolbar>
                </template>
                <template v-slot:[`item.number`]="{index}">{{index + 1}}</template>
                <template v-slot:[`item.regis_date`]="{ item }">{{getThaiDate(item.regis_date)}}</template>
            </v-data-table>
        <!-- </v-card> -->
    </div>
</template>

<script>
import  axios  from "axios";
export default {
    data () {
      return {
        search: '',
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
        columns : [
            {
                label: "ลำดับ",
                field: "number",
            },
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
            }
        ],
 
      }
    },
    created(){
        this.getDetail()
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
                this.datas = response.data.data
                console.log(response);
            
            } catch (error) {
                console.log('error :' + error)
            }
        },
    }

}
</script>

<style scoped>
    .text-name{
        color: #0170c2;
    }

</style>