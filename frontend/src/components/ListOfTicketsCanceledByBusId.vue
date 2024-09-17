<template>
  <div v-if="!isShowListOfCanceledTickets"><v-card>
    <p>Enter the bus name and busNo to get list of Canceled Tickets</p>
   <div class="d-flex flex-row justify-center center align-center"><v-text-field label="Enter Bus Name" ></v-text-field><v-text-field label="Enter Bus Number"></v-text-field></div>
  <div class="d-flex flex-row justify-center align-center"><v-btn variant="outlined" color="green" append-icon="mdi-search" @click="getBusId">Search</v-btn></div>
  </v-card></div>
<div v-else class="d-flex flex-row justify-center align-center">
<v-card width="1000px" class="pa-5 border-thin" :elevation="12" v-for="ticket in listOfCanceledTickets" :key="ticket.ticketId">
      <v-row>
        <v-col>
            <v-row>
            <v-col class="text-deep-orange-darken-1" >Name Of Registered User :-</v-col>
            <v-col>{{ ticket.user.firstName }} {{ ticket.user.lastName }}</v-col>
        </v-row>
        </v-col>
        <v-col>
        <v-row><v-col class="text-deep-orange-darken-1">Email :-</v-col>
        <v-col>{{ ticket.user.email }}</v-col>
        </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
            <v-row>
            <v-col class="text-deep-orange-darken-1">Journey Date :-</v-col>
            <v-col>{{ ticket.ticketDate }}</v-col>
        </v-row>
        </v-col>
        <v-col>
            <v-row>
            <v-col class="text-deep-orange-darken-1">Booking Date :-</v-col>
            <v-col>{{ ticket.bookedAt }}</v-col>
        </v-row>
        </v-col>
      </v-row>
       <v-row>
        <v-col> 
            <v-row>
            <v-col class="text-deep-orange-darken-1">Source :-</v-col>
            <v-col>{{ ticket.source }}</v-col>
        </v-row></v-col>
        <v-col>  <v-row>
            <v-col class="text-deep-orange-darken-1">Destination :-</v-col>
            <v-col>{{ ticket.destination }}</v-col>
        </v-row></v-col>
       </v-row>
       <v-row>
        <v-col>
          <v-row>
            <v-col class="text-deep-orange-darken-1">Total Passengers :-</v-col>
            <v-col>{{ ticket.passengers.length }}</v-col>
        </v-row>
        </v-col>
        <v-col>
        </v-col>
       </v-row>
      <p>ticket Id {{ ticket.ticketId }}</p>
    </v-card>
    </div>
</template>
<script setup>
import {onMounted,computed,ref} from "vue";
import {useRoute } from "vue-router";
import { useStore } from "vuex";
const isShowListOfCanceledTickets = ref(false);
const route = useRoute();
const store = useStore();
const busName = ref(null);
const busNo = ref(null);
const busId = ref(route.query.busId)
const listOfCanceledTickets = computed(()=>store.state.admin.listOfCanceledTicketsByBusId);

const getBusId = async ()=>{
  const busDetail = store.dispatch("triggerGetBusDetailByName",{busName:busName.value,busNo:busNo.value});
  if(busDetail.status==200){
    await store.dispatch("triggerGetListOfCanceledTicketsByBusId",{busId:busDetail.data.busId});
  }
}
onMounted(async ()=>{
 await store.dispatch('triggerGetListOfCanceledTicketsByBusId',{busId:busId.value})
})
</script>