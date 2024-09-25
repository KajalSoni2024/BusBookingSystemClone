<template>
  <div class="d-flex flex-column ga-5 justify-center align-center mt-5">
    <v-card width="1000px" class="pa-5" :elevation="12" v-for="ticket in tickets" :key="ticket.ticketId">
  <div class="d-flex flex-column ga-5">
    <p><b>TicketId:- </b>{{ticket?.ticketId  }}</p>
    <p><b>Bus Name:- </b>{{ ticket?.busDetail?.busName }}</p>
    <p v-if="ticket"><b>Booked At:- </b>{{ getLocalDateTime(ticket.bookedAt) }}</p>
    <div>
      <v-btn variant="outlined" color="deep-orange-darken-1" @click="showTicket(ticket)">View Ticket</v-btn>
    </div>
  </div>
  </v-card>  
  </div>
 <v-dialog v-model="showTicketModal" width="auto">
  <v-card width="1000px" class="pa-5">
    <div><v-icon class="float-right" color="red " @click="showTicketModal=false">mdi-close</v-icon></div>
    <div class="d-flex flex-column ga-5 pl-5">
    <p><b>Bus Name:-  </b><span class="text-deep-orange-darken-2">{{ ticketDetails?.busDetail?.busName }}</span></p>
    <p><b>Bus Number:-  </b><span>{{ ticketDetails?.busDetail?.busNo }}</span></p>
    <p><b>Source:-  </b><span class="text-green">{{ ticketDetails?.source }}</span></p>
    <p><b>Destination:-  </b><span class="text-green">{{ ticketDetails?.destination }}</span></p>
    <p><b>Journey Date:- </b><span v-if="ticketDetails" class="text-green">{{ getLocalDateTime(ticketDetails?.ticketDate)}}</span></p>
    </div>
    <v-card-item>
<div>
    <v-row>
       <v-col><b>Passenger Name</b></v-col>
       <v-col><b>Passenger Gender</b></v-col>
       <v-col><b>Passenger Age</b></v-col>
       <v-col><b>Seat Number</b></v-col>
    </v-row>
    <v-row v-for="passenger in ticketDetails?.passengers" :key="passenger?.seatNumber">
<v-col>{{ passenger?.passengerName }}</v-col>
<v-col>{{ passenger?.passengerGender }}</v-col>
<v-col>{{ passenger?.passengerAge }}</v-col>
<v-col>{{ passenger?.seatNo}}</v-col>
    </v-row>
</div>
</v-card-item>
</v-card>
 </v-dialog>
</template>
<script setup>
import { useStore } from 'vuex';
import {onMounted,computed,ref} from  'vue';
import {useRoute} from 'vue-router';
const route = useRoute();
const store = useStore();
const userId = ref(route.query.userId);
const showTicketModal = ref(false);
const tickets = computed(()=>{
    return store.state.admin.ticketsByUserId;
});

const ticketDetails = ref({})
const showTicket = (ticket)=>{
ticketDetails.value=ticket;
showTicketModal.value=true;
}

const getLocalDateTime = (date)=>{
const newDate  = new Date(date);
return newDate.toLocaleString();
}
onMounted(async()=>{
    await store.dispatch('triggerGetTicketsByUserId',{userId:userId.value});
    console.log('tickets',tickets.value);
    console.log(userId.value)
})
</script>
<style scoped></style>