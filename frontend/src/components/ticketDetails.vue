<template>
    <div style="margin-top: 100px;" class="d-flex justify-center align-center">
  <v-card width="1000px" :elevation="12">
    <v-card-title class="text-center text-h4">Bus Ticket</v-card-title>
<v-card-item>
    <div>
        <v-row>
            <v-col><h2>Bus Name</h2></v-col>
            <v-col>{{ details?.ticketDetails?.busDetail?.busName }}</v-col>
        </v-row>
        <v-row>
            <v-col><h2>Bus Number</h2></v-col>  
            <v-col>{{ details?.ticketDetails?.busDetail?.busNo }}</v-col>
        </v-row>
        <v-row>
            <v-col><h2>Source</h2></v-col>
            <v-col>{{ details?.ticketDetails?.source }}</v-col>
        </v-row>
        <v-row>
            <v-col><h2>Destination</h2></v-col>
            <v-col>{{ details?.ticketDetails?.destination }}</v-col>
        </v-row>
        <v-row>
            <v-col><h2>Booked At</h2></v-col>
            <v-col>{{ getDateTime(details?.ticketDetails?.bookedAt) }}</v-col>
        </v-row>
        <v-row>
            <v-col><h2>Journey Date</h2></v-col>
            <v-col>{{ getDateTime(details?.ticketDetails?.ticketDate) }}</v-col>
        </v-row>
    </div>
</v-card-item>
<v-divider></v-divider>
<v-card-item>
<div>
    <v-row>
       <v-col><b>Passenger Name</b></v-col>
       <v-col><b>Passenger Gender</b></v-col>
       <v-col><b>Passenger Age</b></v-col>
       <v-col><b>Seat Number</b></v-col>
    </v-row>
    <v-row v-for="passenger in details?.passengerDetails" :key="passenger.seatNumber">
<v-col>{{ passenger.passengerName }}</v-col>
<v-col>{{ passenger.passengerGender }}</v-col>
<v-col>{{ passenger.passengerAge }}</v-col>
<v-col>{{ passenger.seatNo}}</v-col>
    </v-row>
</div>

</v-card-item>
   </v-card>
    </div>
</template>
<script setup>
import {onMounted,ref, computed} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
const store = useStore();
const route = useRoute();
const ticketId = ref(route.query.ticketId);
const details = computed(()=>{
   return store.state.users.ticketDetails;
});

const getDateTime = (timestamp)=>{
    console.log(timestamp);
const date = new Date(timestamp);
return date.toLocaleString()
}
onMounted(async()=>{
await store.dispatch("triggerGetTicketDetails",{ticketId:ticketId.value});
console.log(details.value);
});
</script>
<style scoped></style>