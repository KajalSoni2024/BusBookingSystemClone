<template>
    <div v-if="listOfCanceledTickets?.length==0" class="d-flex flex-row justify-center align-center"><p class="text-center">No Request for ticket cancelation</p></div>
    <div class="d-flex flex-column justify-center align-center mt-5 ga-5" v-else><v-card width="1000px" class="pa-5 border-thin" :elevation="12" v-for="ticket in listOfCanceledTickets" :key="ticket?.ticketId">
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
            <v-col class="text-deep-orange-darken-1">Bus Name :-</v-col>
            <v-col>{{ ticket?.busDetail?.busName }}</v-col>
        </v-row>
        </v-col>
        <v-col>
            <v-row>
            <v-col class="text-deep-orange-darken-1">Bus Number :-</v-col>
            <v-col>{{ ticket?.busDetail?.busNo }}</v-col>
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
          <div v-if="ticket?.refundDetail===null" class="d-flex flex-row justify-center align-center"><v-btn variant="outlined" color="green" @click="payRefund(ticket)">Pay Refund</v-btn></div>
        </v-col>
       </v-row>
    </v-card></div>
</template>
<script setup>
import {onMounted,computed,ref} from "vue";
import { useStore } from "vuex";
import { loadStripe } from "@stripe/stripe-js";
const store = useStore();
const stripe = ref(null);
const listOfCanceledTickets = computed(()=>store.state.admin.listOfCanceledTickets);
const payRefund = async (ticket)=>{
   const result =  await store.dispatch("triggerPayRefund",{ticketId:ticket.ticketId, amount:(ticket.busDetail.price*ticket.passengers.length)})
   const session = result.data;
  console.log(session);
  const { error } = await stripe.value.redirectToCheckout({
    sessionId: session.id,
  });
  if (error) {
    console.log(error.message);
  }
}
onMounted(async()=>{
    stripe.value = await loadStripe(
    "pk_test_51PbaP8JlehMaIxjHdvmBnV8l6Xck9klkPSUuTuwlyXwT1sh2etRbmUT2dMjCbWbfuy24TdZhDIATHH0MyPj2ORZe00pM0fsWBY"
  );
   await store.dispatch("triggerGetAllTicketsCanceled");
});
</script>
<style scoped></style>