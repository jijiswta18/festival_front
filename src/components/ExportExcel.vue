<template>
  <div>
    
    <vue-excel-xlsx
        class="btn btn-export"
        :data="datas"
        :columns="columns"
        :file-name="'festival'"
        :file-type="'xlsx'"
        :sheet-name="'festival'"
        >
        <i class="fa-solid fa-file-export icon-style"></i>
        export
    </vue-excel-xlsx>
  </div>
</template>

<script>
  import  axios  from "axios";
export default {
    props: ['id'],
    data(){
        return{
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
    mounted(){
        this.getDetail()
    },
    methods: {
        async getDetail () {
            try {
                let path = await `/api/export_ffuagvylst`
                 let response = await axios.get(`${path}/`+this.id)
                this.datas = response.data.data
            } catch (error) {
                console.log('error :' + error)
            }
        },
    }
}
</script>

<style>
    .btn-export{
        padding: 5px 7px;
        border-radius: 5px;
        background: #4caf50;
        color: white;
    }
    .icon-style{
      font-size: 18px;
    }
</style>