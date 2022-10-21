<!-- <template>
  <v-menu
      ref="menu"
      v-model="menu2"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="time"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        :label="label"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-model="time"
      format="24hr"
      full-width
      @click:minute="$refs.menu.save(time)"
      @input="fnTime(val)"
    ></v-time-picker>
  </v-menu>
</template> -->
<template>
  <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="time"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        :rules="startRules"
        :label="label ? label : 'เวลา'"
        readonly
        v-bind="attrs"
        v-on="on"
        dense
        clearable
        prepend-icon="mdi-clock-time-four-outline"
        @click:clear="time=null"
      ></v-text-field>
    </template>
    <v-time-picker
      v-model="time"
      format="24hr"
      full-width
      @click:minute="$refs.menu.save(time)"
    
    >
    <v-spacer></v-spacer>
    <v-btn
        text
        color="primary"
        @click="menu = false"
    >
        ยกเลิก
    </v-btn>
    <v-btn
        text
        color="primary"
        @click="$refs.menu.save(time)"
    >
        ตกลง
    </v-btn>
    </v-time-picker>
  </v-menu>
</template>


<script>
  export default {
    // props: [ 'label', 'val', 'length'],
    props: [ 'label', 'show_time'],
    data () {
      return {
        time: null,
        menu: false,
        startRules: [v => !!v || "กรุณาใส่ข้อมูล"],
      }
    },
    watch: {
      show_time(){
        if(this.show_time){
          this.time = this.show_time
        }
      },
      time(){
        this.$emit("change_time",this.time)
      }
    },
    methods: {
      // fnTime(v){
      //   v = this.time
      //   this.$emit('get-time', v)
      // }
    }
  }
</script>