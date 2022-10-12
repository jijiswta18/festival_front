<template>
    <div>
        {{image_url}}
        <v-file-input 
            v-if="!image_url"
            v-model="files"
            :rules="rules"
            accept="image/png, image/jpeg"
            
            prepend-icon="mdi-camera"
            label="เเนบรูปเทศกาล"
            @change="onFileChange"
        ></v-file-input>
        <!-- <pre>aaaaaa:{{image_url}}</pre> -->
        <div v-if="image_url">
            <label for="files_path">เเนบรูปเทศกาล</label>
            <div class="d-flex flex-row align-center">
                <div class="preview">
                    <img :src="image_url" />                            
                </div>    
                <v-btn
                    class="mx-2 remove-icon"
                    fab
                    dark
                    x-small
                    color="pink"
                    @click="removePreview"
                >
                    <v-icon dark>fa-xmark</v-icon>
                </v-btn>
                <span class="text-img">ขนาดไม่เกิน 700px * 600px</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['files_path'],
    data: () => ({
        // overlayImg: false,
        // files_path : null,
        image_url: '',
        files: [],
        rules: [
        // value => !!value || 'กรุณาใส่ข้อมูล (ขนาดไม่เกิน 700px * 600px)',
        //   v => (v && v.size > 0) || 'File is required',
            // value => !!value || 'กรุณาใส่ข้อมูล (ขนาดไม่เกิน 700px * 600px)',
            // value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
            value => !value ||  'กรุณาใส่ข้อมูล',
            value => value.size < 2000000 || 'Avatar size should be less than 2 MB!',
        ],
    }),
    watch:{
        files_path(){
            if(this.files_path){
                console.log('aaaaaa');
                this.image_url = this.files_path
            }else{
                this.image_url = ''
            }
        }
    },
    methods:{
        onFileChange(){
            if(this.files){
                this.image_url = URL.createObjectURL(this.files);
                this.$emit('get-file', this.files)
            }else{
                this.image_url =  ''
            }
            
        },
        removePreview(){
            this.image_url  = ''
            this.files      = []
        }
    }
}
</script>

<style>

</style>