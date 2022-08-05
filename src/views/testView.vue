<template>
  <div>{{item}}</div>
</template>

<script>
  import  axios  from "axios";
export default {
    data: () => ({
      item: []
    }),
    created(){
      this.getFestivalSign()
    },
    methods :{
      async getFestivalSign () {
        try {
          let path = await `/api/getFestivalSign`
          let response = await axios.get(`${path}`)
          this.item = response.data.data[0]

          console.log( this.item);
        } catch (error) {
            console.log('error :' + error)
        }
      },
    }
    
}
</script>

<style>

</style>