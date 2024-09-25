<template>
  <div v-if="!isShowListOfCanceledTickets" class="d-flex flex-row justify-center align-center mt-5"><v-card class="pa-5" width="800px">
    <p class="text-h5 ma-5 text-center">Enter the bus name and busNo to get list of Canceled Tickets</p>
   <div class="d-flex flex-row justify-center center align-center mt-5 ga-5"><v-text-field label="Enter Bus Name" v-model="busName"></v-text-field><v-text-field label="Enter Bus Number" v-model="busNo"></v-text-field></div>
  <div class="d-flex flex-row justify-center align-center"><v-btn variant="outlined" color="green" append-icon="mdi-search" @click="getBusId">Search</v-btn></div>
  </v-card></div>
<div v-else class="d-flex flex-column justify-center align-center">
<div class="pa-5"><v-btn class="float-left" color="deep-orange-darken-1" @click="isShowListOfCanceledTickets=false">Back</v-btn></div>
<div v-if="listOfCanceledTickets.length==0" >
  <p class="text-center text-red text-h5">No tickets has been canceled from this bus</p>
</div>

<v-card v-else width="1000px" class="pa-5 border-thin" :elevation="12" v-for="ticket in listOfCanceledTickets" :key="ticket?.ticketId">
      <v-row>
        <v-col>
            <v-row>
            <v-col class="text-deep-orange-darken-1" >Name Of Registered User :-</v-col>
            <v-col>{{ ticket?.user?.firstName }} {{ ticket?.user?.lastName }}</v-col>
        </v-row>
        </v-col>
        <v-col>
        <v-row><v-col class="text-deep-orange-darken-1">Email :-</v-col>
        <v-col>{{ ticket?.user?.email }}</v-col>
        </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
            <v-row>
            <v-col class="text-deep-orange-darken-1">Journey Date :-</v-col>
            <v-col>{{ ticket?.ticketDate }}</v-col>
        </v-row>
        </v-col>
        <v-col>
            <v-row>
            <v-col class="text-deep-orange-darken-1">Booking Date :-</v-col>
            <v-col>{{ ticket?.bookedAt }}</v-col>
        </v-row>
        </v-col>
      </v-row>
       <v-row>
        <v-col> 
            <v-row>
            <v-col class="text-deep-orange-darken-1">Source :-</v-col>
            <v-col>{{ ticket?.source }}</v-col>
        </v-row></v-col>
        <v-col>  <v-row>
            <v-col class="text-deep-orange-darken-1">Destination :-</v-col>
            <v-col>{{ ticket?.destination }}</v-col>
        </v-row></v-col>
       </v-row>
       <v-row>
        <v-col>
          <v-row>
            <v-col class="text-deep-orange-darken-1">Total Passengers :-</v-col>
            <v-col>{{ ticket?.passengers?.length }}</v-col>
        </v-row>
        </v-col>
        <v-col>
        </v-col>
       </v-row>
      <p>ticket Id {{ ticket?.ticketId }}</p>
    </v-card>
    
    </div>
    <v-dialog v-model="isShowAlert" width="auto">
<v-card width="800px" class="pa-5">
  <div><v-icon class="float-right" @click="isShowAlert=false">mdi-close</v-icon></div>
  <p class="text-h5 text-center text-red">Invalid BusName or Bus Number</p>
</v-card>
    </v-dialog>
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
const isShowAlert = ref(false);
const busId = ref(route.query.busId)
const listOfCanceledTickets = computed(()=>store.state.admin.listOfCanceledTicketsByBusId);

const getBusId = async ()=>{
  const busDetail =await store.dispatch("triggerGetBusDetailByName",{busName:busName.value,busNo:busNo.value});
  
  if(busDetail.status==200){
    await store.dispatch("triggerGetListOfCanceledTicketsByBusId",{busId:busDetail.data.busId});
    console.log("dfgsdgdgfgfd",listOfCanceledTickets.value)
    isShowListOfCanceledTickets.value=true;
  }else{
isShowAlert.value=true;
  }
}
onMounted(async ()=>{
 await store.dispatch('triggerGetListOfCanceledTicketsByBusId',{busId:busId.value})
})
</script>