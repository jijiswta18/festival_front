<template>
<!-- <div> -->
    <v-select
        v-model="state"
        :items="selectState"
        label="สถานะการใช้งาน"
        prepend-icon="fa-solid fa-gears"
        dense
    ></v-select>
    <!-- <v-select
        v-model="state"
        :items="selectState"
        :rules="rules.stateRules"
        item-text="value"
        item-value="id"
        label="สถานะการใช้งาน"
        dense
        outlined
    ></v-select> -->
<!-- </div> -->

</template>

<script>
export default {
    data: () => ({
        state: { value: '', id: null },
        selectState: [
            { value: 'ใช้งาน', id: 1 },
            { value: 'ไม่ใช้งาน', id: 2 },
        ],  
        //  items: ['Foo', 'Bar', 'Fizz', 'Buzz'],  
    })
}
</script>

<style>

</style>