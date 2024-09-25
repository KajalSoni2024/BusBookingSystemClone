<template>
    <div><v-btn color="deep-orange-darken-1" @click="backToBusList">Back</v-btn></div>
  <div v-if="passengersList.length>0" class="d-flex flex-column justify-center align-center">
    <v-table width="1000px" height="600px" fixed-header>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Gender</th>
          <th class="text-left">Age</th>
          <th class="text-left">Seat No</th>
          <th class="text-left">Source</th>
          <th class="text-left">Destination</th>
          <th class="text-left">Has Traveled</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="passenger in passengersList" :key="passenger?.passengerId">
        <td>{{ passenger?.passengerName }}</td>
        <td>{{ passenger?.passengerGender }}</td>
        <td>{{ passenger?.passengerAge }}</td>
        <td>{{ passenger?.seatNo }}</td>
        <td>{{ passenger?.source }}</td>
        <td>{{ passenger?.destination }}</td>
        <td><v-checkbox color="deep-orange-darken-1" v-if="passenger" v-model="passenger.hasTraveled" :disabled="canCheckHasTraveledField"  @update:model-value="updateTraveledStatus(passenger)"></v-checkbox></td>
      </tr>
      </tbody>
    </v-table>
    <div class="d-flex flex-column border-thin" width="500px">
      <div class="d-flex flex-row ga-5" width="100%">
        <div class="float-left  pa-5">
          <div class="d-flex flex-row align-center ga-2"><p class="text-deep-orange-darken-1 text-h6"><b>Total Seats :</b></p><p class="text-green">{{totalSeats }}</p></div>
        </div>
       <div class="float-right pa-5">
        <div class="d-flex flex-row align-center ga-2"><p class="text-deep-orange-darken-1 text-h6"><b>Available Seats :</b></p><p class="text-green">{{availableSeats }}</p></div>
      </div>
      </div>
      <div class="d-flex flex-row ga-5" width="100%">
       <div class="float-left pa-5">
        <div class="d-flex flex-row align-center ga-2"><p class="text-deep-orange-darken-1 text-h6"><b>Booked Seats :</b></p><p class="text-green">{{totalTicketsBooked}}</p></div>
      </div>
      <div class="float-right pa-5">
        <div class="d-flex flex-row  align-center ga-2"><p class="text-deep-orange-darken-1 text-h6"><b>People Traveled :</b></p><p class="text-green">{{totalPassengersTraveled}}</p></div>
      </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="text-h4 text-red text-center"><b>No Details of Passengers available for this date </b></p>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { useRouter,useRoute } from "vue-router";
import { onMounted, computed, ref } from "vue";
const store = useStore();
const route = useRoute();
const router = useRouter();
const busId = ref(route.query.busId);
const date = ref(route.query.date);
const totalPassengersTraveled = ref(0);
const totalTicketsBooked = ref(0);
const totalSeats = ref(0);
const passengersList = computed(() => {
  return store.state.users.passengersList;
});
const backToBusList = ()=>{
    router.push({name:"AssignedBuses"});
}
const updateTraveledStatus = async (passenger)=>{
  console.log(passenger.hasTraveled);
    const result = await store.dispatch("triggerUpdatePassengersTraveledStatus",{passengerId:passenger.passengerId, hasTraveled:passenger.hasTraveled});
    if(result.status==200){
      await store.dispatch("triggerGetPassengersList", {
    busId: busId.value,
    date: date.value,
  });
    }
}

const availableSeats = computed(()=>totalSeats.value-totalTicketsBooked.value);
const canCheckHasTraveledField = computed(()=>{
const currentDate = new Date().toLocaleString().split(",")[0].replaceAll("/","-");
if(currentDate==date.value){
  return false
}else{
  return true;
}
})
onMounted(async () => {
  await store.dispatch("triggerGetPassengersList", {
    busId: busId.value,
    date: date.value,
  });
  totalSeats.value = passengersList?.value[0]?.totalSeats;
  totalTicketsBooked.value=passengersList.value.length;
  passengersList.value.forEach(passenger => {
    if(passenger.hasTraveled){
       totalPassengersTraveled.value++;
    }
  });
});
</script>
<style scoped></style>
