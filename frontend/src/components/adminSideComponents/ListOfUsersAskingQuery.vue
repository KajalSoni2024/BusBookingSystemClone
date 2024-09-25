<template>
  <div v-if="listOfChannels?.length==0"><p class="text-center text-h4 text-green">No Querys From any user</p></div>
  <div v-else class="d-flex flex-column justify-center align-center">
        <div class="border-thin rounded-lg pa-3 ma-5" style="width:800px" @click="openChat(channel.user1.userId, channel.user2.userId)" v-for="channel in listOfChannels" :key="channel?.channelId" >
        <div class="d-flex flex-row ga-2">
          <v-icon color="grey">mdi-account-circle</v-icon>
          <p class="text-sm">{{ channel?.user2?.firstName }} {{ channel?.user2?.lastName }}</p>
        </div>
        <div class="mt-2"> 
          <p style="padding-left: 30px;">{{channel?.messages[0]?.message}}</p>
          <p class="float-right">{{ getLocalDateTime(channel?.messages[0]?.createdAt)}}</p>
        </div>
        </div>

  </div>
</template>
<script setup>
import {onMounted,ref} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Pusher from "pusher-js";
const listOfChannels = ref([]);
const store = useStore();
const router = useRouter();
const getLocalDateTime=(time)=>{
  const newDate = new Date(time);
  const date = newDate.toLocaleDateString();
  const hr = newDate.getHours();
  const minutes = newDate.getMinutes();
  return `${date} ${hr}:${minutes}`;
}

const openChat = (senderId , receiverId)=>{
  router.push({name:'AdminChat',query:{sender_id:senderId,receiver_id:receiverId}})
}

onMounted(async ()=>{
    listOfChannels.value= await store.dispatch("triggerGetAllMessagesByChannel");
    console.log(listOfChannels.value);
    let pusher = new Pusher('5255d55b22b71ccf514f', { cluster: 'ap2' })
      pusher.subscribe('messages')
      pusher.bind('message_data', async (data) => {
        console.log(data);
        listOfChannels.value = await store.dispatch("triggerGetAllMessagesByChannel"); 
      }); 
})
</script>
<style scoped></style>