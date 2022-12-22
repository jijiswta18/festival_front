<template>
    <div class="text-center">
        <v-dialog
        v-model="dialog"
        width="700"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="lighten-2 mb-5"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    :style="{'background-color': color}"
                    >
                    เลือกคำอวยพร
                </v-btn>
                
            </template>

            <v-card>
                <v-toolbar class="grey lighten-2">
                    <v-toolbar-title>รายการคำอวยพร</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                        icon
                        dark
                        color="#213862"
                        colored-border
                        @click="dialog = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <div v-if="datas.length > 0">
                    <v-radio-group v-model="radioReference">
                        <v-radio
                            class="ref-redio"
                            v-for="(data, i) in datas"
                            :key="i"
                            :label="`${data.name}`"
                            :value="data.name"
                            @click="selectRedio(data)"
                        ></v-radio>
                    </v-radio-group>

                </div>
                <div v-else><h4 class="text-center py-2">ไม่มีข้อมูล</h4></div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from "axios";
export default {
    props: ['festival_id', 'color'],
    data () {
      return {
        dialog: false,
        radioReference: 0,
        datas: [],
        reference: [],
      }
    },
    mounted(){
        this.getSelectReference()
       
    },
    methods:{
        selectRedio(v){
            this.dialog = false,
            this.reference = v

            // console.log(this.radioGroup);
            this.$emit("change_reference",this.reference)
          
            // this.radioGroup = v
            console.log(this.reference);
        },
        async getSelectReference(){

            let path = await `/api/get/detailReference`;
            
            let response = await axios.get(`${path}/`+ this.festival_id) 

            this.datas = response.data.data

            console.log(this.datas);
                
        },
    }

}
</script>

<style scoped>
    /* .v-input--selection-controls {
        margin-top: 0px;
        padding-top: 0px;
    } */
    .v-input--radio-group--column .v-radio:not(:last-child):not(:only-child) {
        margin-bottom: 0px;
        border-bottom: 1px solid #e0e0e0;
      
    }
    .ref-redio{
        padding: 0.5rem;
    }
    .ref-redio label{
        color: #213862;
    }
</style>