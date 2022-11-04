<template>
  <div>
    <vue-excel-xlsx
        class="btn btn-export"
        :data="datas"
        :columns="columns"
        :file-name="`รายงานลงนามถวายพระพร เทศกาล${filename}`"
        :file-type="'xlsx'"
        :sheet-name="`เทศกาล${filename}`"
        >
        <i class="fa-solid fa-file-export icon-style"></i>
        export
    </vue-excel-xlsx>
  </div>
</template>

<script>
    import  axios  from "axios";
export default {
    props: ['id', 'filename'],
    data(){
        return{
            datas: [],
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
                let response = await axios.get(`${path}/`+this.id)
                // this.datas = response.data.data
                response.data.data.forEach(item => {
                    this.datas.push({ 
                        'name'      : item.name + ' ' + item.lastname,
                        'browser'   : item.browser,
                        'device'    : item.device,
                        'regis_date': this.getThaiDate(item.regis_date),
                        'IP'        : item.ip_user
                    })
                })

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