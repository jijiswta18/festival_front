<template>
    <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
    >
        <template v-slot:activator="{ on, attrs }">
        <h1>{{val}}</h1>
        <h1>{{date}}</h1>
        <v-text-field
            v-model="dateFormatted"
            :label="label"
            hint="MM-DD-YYYY format"
            persistent-hint
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            @blur="date = parseDate(dateFormatted)"

            v-on="on"
        ></v-text-field>
        </template>
        <v-date-picker
            v-model="date"
            no-title
            @input="fnDate(val)"
        ></v-date-picker>
        
    </v-menu>
</template>

<script>
  export default {
    props:['label', 'val'],

    data: vm => ({
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
      menu1: false,
      menu2: false,
      test: false,
    }),

    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
    },

    watch: {
      date () {
        this.dateFormatted = this.formatDate(this.date)

      },
    },

    created(){
      this.fnDate()
    },
    


    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },

      fnDate (v){
        this.menu1 = false
        v = this.date
        this.$emit('get-date', v)
      }
    },
  }
</script>