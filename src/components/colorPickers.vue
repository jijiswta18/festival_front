<template>
    <v-text-field v-model="color" hide-details class="ma-0 pa-0" solo>
        <template v-slot:append>
            <v-menu v-model="color_menu" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
                <div :style="swatchStyle" v-on="on" />
            </template>
            <v-card>
            
                <v-card-text class="pa-0">
                <v-color-picker   mode="hexa" v-model="color" show-swatches />
                </v-card-text>
            </v-card>
            </v-menu>
        </template>
    </v-text-field>
</template>
<script>
    export default{
        props: ['show_color'],
        data(){
            return {
                color: '#1976D2FF',
                color_menu: false
            }
        },
        watch: {
            show_color(){
                if(this.show_color){
                    this.color = this.show_color
                }else{
                    this.color = '#1976D2FF'
                }
            }
        },
        computed: {
            swatchStyle() {
                const { color, color_menu } = this
                return {
                backgroundColor: color,
                cursor: 'pointer',
                height: '30px',
                width: '30px',
                borderRadius: color_menu ? '50%' : '4px',
                transition: 'border-radius 200ms ease-in-out'
                }
            },
        },
    }
</script>