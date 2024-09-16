<template>
    <div>
        <v-text-field label="Email" v-model="emailBody.to"></v-text-field>
        <v-text-field label="Subject" v-model="emailBody.subject"></v-text-field>
        <v-text-field label="Message" v-model="emailBody.text"></v-text-field>
    </div>
    <div class="d-flex flex-row justify-center align-center"><v-btn @click="sendEmail" variant="outlined">Send</v-btn></div>
</template>
<script setup>
import {reactive} from "vue";
import {useStore} from "vuex";
const store = useStore();
const emailBody = reactive({
    to:null,
    subject:null,
    text:null
})

const sendEmail =async ()=>{
  const result =  await store.dispatch("triggerSendEmail",emailBody);
  if(result.status=='201'){
    console.log(result.data);
  }
}

</script>
<style scoped></style>