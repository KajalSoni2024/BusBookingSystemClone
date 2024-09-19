<template>
    <div><p class="text-center text-h4">Ask your question</p></div>
    <div class="d-flex flex-row justify-center align-center">
      <v-card width="1000px" height="800px">
        <div class="scrollable pa-5" >
        <div :class="message.receiver.userId===receiver_id?'float-right':'float-left'" class="border-thin rounded-lg pa-3 ma-5 msgBox" v-for="message in messages" :key="message.messageId">
        <div class="d-flex flex-row ga-2">
          <v-icon color="grey">mdi-account-circle</v-icon>
          <p class="text-sm">{{ message.sender.firstName }} {{ message.sender.lastName }}</p>
        </div>
          <p style="padding-left: 30px;">{{ message.message }}</p>
          <p class="float-right">{{ getLocalDateTime(message.createdAt) }}</p>
        </div>
      </div>
        <div class="d-flex flex-row justify-center align-center"><v-text-field label="Message" @keyup.enter="sendMessage" v-model="message"></v-text-field><v-icon @click="sendMessage">mdi-send</v-icon></div>
    </v-card>
    </div>
  
</template>
<script setup>
import {onMounted,ref,computed} from "vue";
import { useStore } from "vuex";
import Pusher from "pusher-js";
const store = useStore();
const message = ref(null)
const receiver_id = ref(2);

const messages = computed(()=> store.state.users.messages);
const sendMessage = async ()=>{
  const result =await store.dispatch("triggerSendMessage",{message:message.value, receiver_id:receiver_id.value });
  if(result.status==201){
    message.value="";
  }
}
const getLocalDateTime=(time)=>{
  const newDate = new Date(time);
  const date = newDate.toLocaleDateString();
  const hr = newDate.getHours();
  const minutes = newDate.getMinutes();
  return `${date} ${hr}:${minutes}`;
}
onMounted(async()=>{
   await store.dispatch("triggerGetMessages",{receiverId:2});
    let pusher = new Pusher('5255d55b22b71ccf514f', { cluster: 'ap2' })
      pusher.subscribe('messages')
      pusher.bind('message_data', data => {
        console.log(data)
       messages.value.push(data)
      }); 
})
</script>
<style scoped>
.scrollable{
  max-height: 700px;
  overflow-y: auto;
}
.msgBox{
  width:400px;
  clear:both;
}
</style>