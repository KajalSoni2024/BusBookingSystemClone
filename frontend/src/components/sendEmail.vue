<template>
    <div>
        <v-text-field label="Email" v-model="emailBody.to"></v-text-field>
        <v-text-field label="Subject" v-model="emailBody.subject"></v-text-field>
        <v-text-field label="Message" v-model="emailBody.text"></v-text-field>
    </div>
</template>
<script setup>
import {onMounted, reactive} from "vue";
const emailBody = reactive({
    to:null,
    subject:null,
    text:null
})
onMounted(()=>{

})

</script>
<style scoped></style>