<template>
    <template v-if="bookedTickets && bookedTickets?.length>0">
        <div v-for="ticket in bookedTickets" :key="ticket.paymentId" class="d-flex flex-column align-center mt-5">
    <v-card width="1000px" class="pa-2">
        <v-row><v-col>Bus Name</v-col><v-col>{{ticket?.ticketWithPassenger?.busDetail?.busName }}</v-col></v-row>
        <v-row><v-col>Source</v-col><v-col>{{ ticket.ticketDetail.source }}</v-col></v-row>
        <v-row><v-col>Destination</v-col><v-col>{{ ticket.ticketDetail.destination }}</v-col></v-row>
        <v-row><v-col>Journey Date</v-col><v-col>{{ getLocalDateTime(ticket.ticketDetail.ticketDate) }}</v-col></v-row>
        <div class="d-flex flex-row ga-2 mt-2">
            <v-btn color="deep-orange-darken-2" variant="outlined" @click="viewTicket(ticket.ticketDetail.ticketId)">View Ticket</v-btn>
            <v-btn color="deep-orange-darken-2
" @click="cancelTicket(ticket)">Cancel Ticket</v-btn></div>
    </v-card>
</div>
</template>
<template v-else>
    <div style="margin-top:100px" class="d-flex flex-row justify-center align-center"><p class="text-red text-h4 text-center">No booking available</p></div>
</template>
 
<v-dialog v-model="isViewTicket" width="auto">
<v-card width="1000px" class="pa-5">
    <div><v-icon class="float-right" color="red " @click="isViewTicket=false">mdi-close</v-icon></div>
    <div class="d-flex flex-column ga-5 pl-5">
    <p><b>Bus Name:-  </b><span class="text-deep-orange-darken-2">{{ ticketDetails[0].ticketWithPassenger.busDetail.busName }}</span></p>
    <p><b>Bus Number:-  </b><span>{{ ticketDetails[0].ticketWithPassenger.busDetail.busNo }}</span></p>
    <p><b>Source:-  </b><span class="text-green">{{ ticketDetails[0].ticketWithPassenger.source }}</span></p>
    <p><b>Destination:-  </b><span class="text-green">{{ ticketDetails[0].ticketWithPassenger.destination }}</span></p>
    </div>
    <v-card-item>
<div>
    <v-row>
       <v-col><b>Passenger Name</b></v-col>
       <v-col><b>Passenger Gender</b></v-col>
       <v-col><b>Passenger Age</b></v-col>
       <v-col><b>Seat Number</b></v-col>
    </v-row>
    <v-row v-for="passenger in ticketDetails[0]?.ticketWithPassenger?.passengers" :key="passenger.seatNumber">
<v-col>{{ passenger.passengerName }}</v-col>
<v-col>{{ passenger.passengerGender }}</v-col>
<v-col>{{ passenger.passengerAge }}</v-col>
<v-col>{{ passenger.seatNo}}</v-col>
    </v-row>
</div>
</v-card-item>
</v-card>
</v-dialog>
</template>
<script setup>
import { onMounted , computed, ref} from "vue";
import { axiosPost } from "@/services/service";
import {useStore} from "vuex";
const store  = useStore();
const isViewTicket = ref(false);
const bookedTickets = computed(()=>{
    return store.state.users.bookedTickets;
});
const cancelTicket = async (ticket)=>{
    console.log("ticket",ticket);
    const result = await axiosPost('/tickets/cancelBookedTicket',ticket);  
    console.log(result)
   await store.dispatch("triggerGetBookedTickets");
}

const ticketDetails = ref([]);
const viewTicket = async (ticketId)=>{
    ticketDetails.value = bookedTickets.value.filter((ticket)=>{return ticket.ticketDetail.ticketId==ticketId})
    isViewTicket.value=true;
}

const getLocalDateTime = (date)=>{
const newDate = new Date(date);
return newDate.toLocaleString();
}
onMounted(async ()=>{
await store.dispatch("triggerGetBookedTickets");
console.log(bookedTickets.value);
});
</script>
<style></style>