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
                <v-toolbar-title>ระบบลงนามถวายพระพร</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="ค้นหา (ชื่อเทศกาล, จำนวน)"
                    single-line
                    hide-details
                ></v-text-field>
            </v-toolbar>
        </template>
        <!-- <template v-slot:[`item.number`]="{index}">{{index + 1}}</template> -->
        <template v-slot:[`item.export`] ="{ item }">
            <ExportExcel :id="item.id" :filename="item.name"/>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn
            class="mx-2 btn-default"
            x-small
            fab
            dark
            color="primary"
            @click="detail(item)"
            >
            <i class="fa-solid fa-magnifying-glass icon-style"></i>
            </v-btn>
            
        </template>
    </v-data-table>
</template>
<script>
  import  axios  from "axios";
  import ExportExcel from "@/components/ExportExcel.vue";
  
  export default {
    components: { ExportExcel },
    data() {
        return {
            search: "",
            loadTable: true,
            headers: [
                // {
                //     text: "",
                //     align: "start",
                //     filterable: false,
                //     value: "number",
                // },
                { text: "ชื่อเทศกาล", value: "name" },
                { text: "จำนวนคนลงนาม (คน)", align: "center", value: "totalCount" },
                { text: "ดาวน์โหลด", align: "center", value: "export", sortable: false },
                { text: "รายชื่อคนลงนาม", align: "center", value: "actions", sortable: false },
               
            ],
            datas: [],
            items: [],
            columns: [
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
        };
    },
    mounted() {
        this.ReportFestival();
        // this.getExport()
    },
    methods: {
        detail(v) {
            this.$router.push({ name: "reportSign",  params: { id: v.id } });
        },
        async ReportFestival() {
            try {
                let path = await `/api/getReportFestival`;
                let response = await axios.get(`${path}`);
                this.datas = await response.data.data;
                this.loadTable = await false;
            }
            catch (error) {
                console.log("error :" + error);
            }
        },
        async fetchData(v) {
            try {
                let path = await `/api/export_ffuagvylst`;
                let response = await axios.get(`${path}/` + v);
                this.items = response.data.data;
                return this.items;
            }
            catch (error) {
                console.log("error :" + error);
            }
        },
    },
   
}
</script>
<style scoped>
    .text-name{
        color: #0170c2;
    }
    .icon-style{
      font-size: 18px;
    }
   
</style>