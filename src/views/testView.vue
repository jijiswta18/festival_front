<template>
    <div>
       
    <div 
      @click="exportExcel"
     
    >export
    </div>
    </div>
    
</template>

<script>
    import XLSX from 'xlsx/xlsx';
    import  axios  from "axios";
    export default {
        name: "vue-excel-xlsx1",
        data(){
          return{
          
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
            item: [],
            fileName: {
                type: String,
                default: 'excel'
            },
            sheetName: {
                type: String,
                default: 'SheetName'
            },
            fileType: {
                type: String,
                default: 'xlsx',
                validator: (val) => ['xlsx', 'xls'].includes(val)
            }
          }
        },
        // props: {
        //     columns: {
        //         type: Array,
        //         default: () => [
        //            {
        //                 label: "ลำดับ",
        //                 field: "number",
        //             },
        //             {
        //                 label: "ชื่อ-สกุล",
        //                 field: "name",
        //             },
        //             {
        //                 label: "Browser",
        //                 field: "browser",
        //             },
        //             {
        //                 label: "Device",
        //                 field: "device",
        //             },
        //             {
        //                 label: "วันที่ลงนาม",
        //                 field: "regis_date",
        //             }
        //                 ]
        //             },
        //             data: {
        //               type: Array,
        //               default: () =>  [{}]
        //             },
        //             fileName: {
        //                 type: String,
        //                 default: 'excel'
        //             },
        //             sheetName: {
        //                 type: String,
        //                 default: 'SheetName'
        //             },
        //             fileType: {
        //                 type: String,
        //                 default: 'xlsx',
        //                 validator: (val) => ['xlsx', 'xls'].includes(val)
        //             }
        //         },
        methods: {
       
            async exportExcel() {
                let createXLSLFormatObj = [];
                let newXlsHeader = [];
                let vm = this;
                // if (vm.columns.length === 0){
                //     console.log("Add columns!");
                //     return;
                // }
                // if (vm.item.length === 0){
                //     console.log("Add data!");
                //     return;
                // }
                vm.columns.map(column => {
                    newXlsHeader.push(column.label);
                });
                createXLSLFormatObj.push(newXlsHeader);

                let path = await `/api/getReportFestival`
                let response = await axios.get(`${path}`,)
                
                vm.item = await response.data.data
                await console.log(vm.item.length);
               
                await vm.item.map(value => {
                    let innerRowData = [];
                    vm.columns.map(val => {
                      let fieldValue = value[val.field];
                      if (val.field.split('.').length > 1) {
                        fieldValue = this.getNestedValue(value, val.field);
                      }
                      if (val.dataFormat && typeof val.dataFormat === 'function') {
                            innerRowData.push(val.dataFormat(fieldValue));
                        } else {
                            innerRowData.push(fieldValue);
                        }
                    });
                    createXLSLFormatObj.push(innerRowData);
                });
                let fileName = vm.fileName + "." + vm.fileType;
                let ws_name = vm.sheetName;
                let wb = XLSX.utils.book_new(),
                ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
                XLSX.utils.book_append_sheet(wb, ws, ws_name);
                XLSX.writeFile(wb, fileName);
            },
            getNestedValue(object, string) {
                string = string.replace(/\[(\w+)\]/g, '.$1');
                string = string.replace(/^\./, '');
                let a = string.split('.');
                for (let i = 0, n = a.length; i < n; ++i) {
                  let k = a[i];
                  if (k in object) {
                    object = object[k];
                  } else {
                    return;
                  }
                }
                return object;
            }
        }
    }
</script>