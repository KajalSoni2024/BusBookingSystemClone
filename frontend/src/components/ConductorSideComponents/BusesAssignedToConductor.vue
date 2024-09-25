<template>
<div class="d-flex flex-column justify-center align-center pa-5" v-if="assignedBuses?.length>0">
<v-card class="pa-5" width="1000px" v-for="bus in assignedBuses" :key="bus?.busId">
  <v-row>
    <v-col>
        <div class="d-flex flex-column">
            <p class="text-h6 text-deep-orange-darken-1"><b>Bus Name</b></p>
            <p class="text-green">{{ bus?.busName }}</p>
        </div>
    </v-col>
    <v-col>
        <div class="d-flex flex-column">
            <p class="text-h6 text-deep-orange-darken-1"><b>Bus Number</b></p>
            <p class="text-green">{{ bus?.busNo }}</p>
        </div>    
    </v-col>
  </v-row>
  <v-row>
    <v-col>
        <div class="d-flex flex-column">
            <p class="text-h6 text-deep-orange-darken-1"><b>Total Seats</b></p>
            <p class="text-green">{{ bus?.totalSeats }}</p>
        </div> 
    </v-col>
    <v-col>
        <div class="d-flex flex-column">
            <p class="text-h6 text-deep-orange-darken-1"><b>Price</b></p>
            <p class="text-green">{{ bus?.price }}</p>
        </div> 
    </v-col>
  </v-row>
  <v-row>
    <v-col>
        <h4>Driver's Details</h4>
        <div class="d-flex flex-row ga-5">
        <div class="d-flex flex-column ga-2"> 
            <p class="text-h6 text-deep-orange-darken-1"><b>Name</b></p>
            <p class="text-green">{{ bus?.driver?.firstName}} {{ bus?.driver?.lastName }}</p>
        </div>
        <div  class="d-flex flex-column ga-2"> 
         <p class="text-h6 text-deep-orange-darken-1"><b>Contact</b></p>
         <p class="text-green">{{ bus?.driver?.contact }}</p>
        </div>
        </div>
    </v-col>
    <v-col>
        <h4>Conductor's Details</h4>
        <div class="d-flex flex-row ga-5">
        <div class="d-flex flex-column ga-2"> 
            <p class="text-h6 text-deep-orange-darken-1"><b>Name</b></p>
            <p class="text-green">{{ bus?.conductor?.firstName}} {{ bus?.conductor?.lastName }}</p>
        </div>
        <div  class="d-flex flex-column ga-2"> 
         <p class="text-h6 text-deep-orange-darken-1"><b>Contact</b></p>
         <p class="text-green">{{ bus?.conductor?.contact }}</p>
        </div>
        </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col></v-col>
    <v-col> <div>
    <div class="d-flex flex-row ga-5 align-center"><v-btn v-if="bus" variant="outlined" color="deep-orange-darken-1" @click="showDateSelectModal(bus.busId)">Show Passenger List</v-btn><v-btn variant="outlined" color="green" @click="showRoute(bus.routes)">Show Route</v-btn></div>
  </div></v-col>
  </v-row>
 
</v-card>
</div>
<div v-else class="d-flex flex-column justify-center align-center pa-5"><p class="text-red text-h4"><b>No Buses Assigned Yet</b></p></div>
<v-dialog v-model="selectDateModal" width="auto">
<v-card class="pa-5" width="500px">
<div><v-icon class="float-right" @click="selectDateModal=false">mdi-close</v-icon></div>
<div class="d-flex flex-column justify-center align-center">
<p>Journey Date</p>
<v-text-field type="date" v-model="journeyDate" color="deep-orange-darken-1"></v-text-field>
<div class="d-flex flex-row justify-center align-center"><v-btn color="deep-orange-darken-1" variant="outlined" @click="showList">Show List</v-btn></div>
</div>
</v-card>
</v-dialog>
<v-dialog width="auto" v-model="isShowRouteModal">
        <v-card width="800px" :elevation="12" class="pa-5">
          <div>
            <v-icon class="float-right" @click="isShowRouteModal = false" color="deep-orange-darken-1"
            >mdi-close</v-icon
          >
          </div>
         
          <div
            class="d-flex flex-row align-center ga-5 pa-5"
            v-for="route in busRoutes"
            :key="route?.routeId"
          >
          <div class="d-flex flex-column justify-start">
            <div class="d-flex flex-row align-center">
            <v-icon size="50" color="deep-orange-darken-1">mdi-bus-stop</v-icon>
            <p class="text-h5 text-green">{{ route?.stopName }}</p>
          </div>
         <div class="d-flex flex-row pl-2 ga-5">      <p><b>Arrival: </b>{{ route?.arrivalTime }}</p>
            <p><b>Departure: </b>{{ route?.departTime }}</p></div>
          </div>
          </div>
        </v-card>
      </v-dialog>

</template>
<script setup>
import { onMounted,ref, computed} from 'vue';
import {useStore} from "vuex"; 
const store = useStore();
const selectDateModal = ref(false);
const journeyDate = ref(null);
const busId = ref(null);
const busRoutes = ref([]);
import { useRouter } from 'vue-router';
const router = useRouter();
const assignedBuses = computed(()=>{
    return store.state.users.assignedBuses;
});
const isShowRouteModal = ref(false);
const showDateSelectModal = (id)=>{
    busId.value=id;
    selectDateModal.value=true;
}
const showRoute = (routes)=>{
busRoutes.value=routes;
isShowRouteModal.value=true;
}
const showList = ()=>{
    showDateSelectModal.value=false;
router.push({name:"ListOfPassengers",query:{date:journeyDate.value,busId:busId.value}})
}
onMounted(async ()=>{
await store.dispatch("triggerGetAssignedBuses");
console.log("assignedBuses",assignedBuses.value);
})
</script>
<style scoped></style>