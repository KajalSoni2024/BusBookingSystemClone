<template>
  <div class="d-flex flex-column justify-center align-center mainDiv">
    <h1 class="text-center">Add Details</h1>
    <v-card
      width="1000px"
      class="pa-5 scroll"
      style="border: 3px solid rgb(246, 126, 83)"
    >
      <v-text-field
        color="deep-orange-darken-1"
        type="date"
        label="Date"
        @blur="v$.ticketDate.$touch"
        :error-messages="v$.ticketDate.$errors.map((e)=>e.$message)"
        v-model="ticketDate"
      ></v-text-field>
      <div class="border-thin ma-3 pa-3" v-for="passenger in passengerData" :key="passenger.id">
        <v-text-field
          label="Name"
          color="deep-orange-darken-1"
          @blur="v$.name.$touch"
          :error-messages="v$.name.$errors.map((e)=>e.$message)"
          v-model="passenger.name"
        ></v-text-field>
        <v-radio-group
          label="Gender"
          color="deep-orange-darken-1"
          v-model="passenger.gender"
          inline
          @blur="v$.gender.$touch"
          :error-messages="v$.gender.$errors.map((e)=>e.$message)"
        >
      <v-radio value="male" label="Male" ></v-radio>
      <v-radio value="female" label="Female"></v-radio>
      <v-radio value="others" label="Others"></v-radio>
      </v-radio-group>
        <v-text-field
          label="Age"
          color="deep-orange-darken-1"
          v-model="passenger.age"
          @blur="v$.age.$touch"
          :error-messages="v$.age.$errors.map((e)=>e.$message)"
        ></v-text-field>
      </div>
      <div>
        <v-btn class="bg-deep-orange-darken-1 ma-2" @click="addPassenger"
          >Add Passenger</v-btn
        >
        <v-btn
          variant="outlined"
          color="deep-orange-darken-1"
          class="ma-2"
          @click="removePassenger"
          >Remove</v-btn
        >
        <p class="text-h6 text-right">
          <span class="text-deep-orange-darken-1">Price </span>
          <span>-/{{ price * passengerData.length }}</span>
        </p>
      </div>
      <div style="width:100%" gap="10%" class="border-lg d-flex flex-row justify-center align-center">
        <div style="width:40%" class="d-flex flex-row flex-wrap" v-if="seatsWithSelectedOpt?.length">
          <template v-for="i in seatsWithSelectedOpt.length/2" :key="i.seatId"><div v-if="seatsWithSelectedOpt[i]?.isBooked" class="seat baseColor border-thin pa-5 ma-3">{{ seatsWithSelectedOpt[i].seatNumber }}</div>
            <div v-else class="seat border-thin pa-5 ma-3" :class="{baseColor:seatsWithSelectedOpt[i].isSelected}" @click="selectSeat(seatsWithSelectedOpt[i])">{{ seatsWithSelectedOpt[i-1].seatNumber }}</div></template>
        </div>
        <div style="width:10%" ></div>
       <div style="width: 40%;" class="d-flex flex-row flex-wrap" v-if="seatsWithSelectedOpt?.length">
        <template v-for="i in seatsWithSelectedOpt.length/2" :key="seatsWithSelectedOpt[i+halfSeat-1].seatId"><div  v-if="seatsWithSelectedOpt[i+halfSeat-1].isBooked" class="seat baseColor pa-5 ma-3">{{ seatsDetails[i+halfSeat-1].seatNumber }}</div>
          <div  @click="selectSeat(seatsWithSelectedOpt[i+halfSeat-1])" v-else :class="{baseColor:seatsWithSelectedOpt[i+halfSeat-1].isSelected}" class="seat border-thin pa-5 ma-3">{{ seatsWithSelectedOpt[i+halfSeat-1].seatNumber }}</div></template>
       </div>
      </div>
      <div class="d-flex flex-row justify-center align-center">
        <v-btn class="bg-green" @click="pay">Proceed To Pay</v-btn>
      </div>
    </v-card>
  </div>
</template>
<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required,helpers} from "@vuelidate/validators";
import { useRoute } from "vue-router";
import {useStore} from "vuex";
import { ref, reactive, onMounted, computed} from "vue";
import { axiosPost } from "@/services/service";
import { loadStripe } from "@stripe/stripe-js";
import { isFirstLetterCapital, isOnlyDigits, onlyChars } from "../../public/validation";
const route = useRoute();
const busId = ref(route.query.busId);
const source = ref(route.query.source);
const dest = ref(route.query.dest);
const price = ref(route.query.price);
const total = ref(route.query.total);
const stripe = ref(null);
const ticketDate = ref(null);
const store = useStore();
const seatsDetails = computed(()=>{
  return store.state.users.busSeatsByBusId;
});
const seatsWithSelectedOpt= ref([])
const halfSeat = computed(()=>{
  return seatsDetails.value.length/2;
})
const passengerData = reactive([
  {
    id: 1,
    name: null,
    gender: null,
    age: null,
    busId: busId.value,
  },
]);

const rules = computed(()=>{
  return {
    name:{required, onlyChars:helpers.withMessage("Passenger's name should contain only characters",onlyChars),isFirstLetterCapital:helpers.withMessage("First letter of name should be capital",isFirstLetterCapital)},
    gender:{required},
    age:{required,isOnlyDigits:helpers.withMessage("Age should be only in numbers",isOnlyDigits)},
    ticketDate:{required}
  }
})

const v$ = useVuelidate(rules,{ticketDate,...passengerData});
function addPassenger() {
  const length = passengerData.length;
  if(length<total.value)
  passengerData.push({
    id: length + 1,
    name: null,
    gender: null,
    age: null,
    busId: busId.value,
  });
}

function removePassenger() {
  passengerData.pop();
}

async function pay() {
  const selectedSeats = seatsWithSelectedOpt.value.filter((seat)=>seat.isSelected==true);
  if(selectedSeats.length!=total.value){
    alert(`Please select only ${total.value} seats`);
    return;
  }
  const ticket = await axiosPost("/tickets/createTicket", {
    source: source.value,
    destination: dest.value,
    ticketDate: ticketDate.value,
    busDetail: busId.value,
  });
  console.log(ticket);
  if (ticket.status == 200) {
    const ticketId = ticket.data.ticketId;
    const addPassResult = await axiosPost("/addPassengers", {
      ticketId: ticketId,
      passengers: passengerData,
      seats:selectedSeats
    });
    if (addPassResult.status) {
      console.log(addPassResult);
    }
  }
  const result = await axiosPost("/makePayment", {
    price: price.value * passengerData.length,
    ticketId: ticket.data.ticketId,
  });

  const session = result.data;
  console.log(session);
  const { error } = await stripe.value.redirectToCheckout({
    sessionId: session.id,
  });
  if (error) {
    console.log(error.message);
  }
}

 const selectSeat = (seat)=>{
  seat.isSelected = !seat.isSelected;
 }
 onMounted(async () => {
  await store.dispatch("triggerGetBusSeatsByBusId",{busId:busId.value});
  stripe.value = await loadStripe(
    "pk_test_51PbaP8JlehMaIxjHdvmBnV8l6Xck9klkPSUuTuwlyXwT1sh2etRbmUT2dMjCbWbfuy24TdZhDIATHH0MyPj2ORZe00pM0fsWBY"
  );
  seatsWithSelectedOpt.value = 
 seatsDetails.value.map((seat)=>{
   return {...seat, isSelected:false}
 })


});
</script>
<style scope>
.mainDiv {
  margin-top: 100px;
}
.scroll{
  height: 800px;
  overflow-y: auto;
}
.baseColor{
  background-color: rgb(73, 77, 77);
}
</style>
