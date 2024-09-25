<template>
    <template v-if="bookedTickets && bookedTickets?.length>0">
        <div v-for="ticket in bookedTickets" :key="ticket?.paymentId" class="d-flex flex-column align-center mt-5">
    <v-card width="1000px" class="pa-2">
        <v-row><v-col>Bus Name</v-col><v-col>{{ticket?.ticketWithPassenger?.busDetail?.busName }}</v-col></v-row>
        <v-row><v-col>Source</v-col><v-col>{{ ticket?.ticketDetail?.source }}</v-col></v-row>
        <v-row><v-col>Destination</v-col><v-col>{{ ticket?.ticketDetail?.destination }}</v-col></v-row>
        <v-row><v-col>Journey Date</v-col><v-col v-if="ticket">{{ getLocalDateTime(ticket?.ticketDetail?.ticketDate) }}</v-col></v-row>
        <div v-if="ticket" class="d-flex flex-row ga-2 mt-2">
            <v-btn color="deep-orange-darken-2" variant="outlined" @click="viewTicket(ticket.ticketDetail.ticketId)">View Ticket</v-btn>
            <v-btn color="deep-orange-darken-2
" @click="showConfirmationModal(ticket)">Cancel Ticket</v-btn></div>
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
    <p><b>Bus Name:-  </b><span class="text-deep-orange-darken-2">{{ ticketDetails[0]?.ticketWithPassenger?.busDetail?.busName }}</span></p>
    <p><b>Bus Number:-  </b><span>{{ ticketDetails[0]?.ticketWithPassenger?.busDetail?.busNo }}</span></p>
    <p><b>Source:-  </b><span class="text-green">{{ ticketDetails[0]?.ticketWithPassenger?.source }}</span></p>
    <p><b>Destination:-  </b><span class="text-green">{{ ticketDetails[0]?.ticketWithPassenger?.destination }}</span></p>
    </div>
    <v-card-item>
<div>
    <v-row>
       <v-col><b>Passenger Name</b></v-col>
       <v-col><b>Passenger Gender</b></v-col>
       <v-col><b>Passenger Age</b></v-col>
       <v-col><b>Seat Number</b></v-col>
    </v-row>
    <v-row v-for="passenger in ticketDetails[0]?.ticketWithPassenger?.passengers" :key="passenger?.seatNumber">
<v-col>{{ passenger?.passengerName }}</v-col>
<v-col>{{ passenger?.passengerGender }}</v-col>
<v-col>{{ passenger?.passengerAge }}</v-col>
<v-col>{{ passenger?.seatNo}}</v-col>
    </v-row>
</div>
</v-card-item>
</v-card>
</v-dialog>
<v-dialog v-model="isShowOtpModal" width="auto">
    <v-card class="pa-5" width="600px">
        <div><v-icon class="float-right" @click="isShowOtpModal=false">mdi-close</v-icon></div>
        <div class="d-flex flex-row justify-center align-center">
            <p class="text-primary">Enter Otp</p>
            <v-otp-input length="6" v-model="otp"></v-otp-input>
            <p v-if="timeLimit>=10" class="text-primary">Otp Will be Expired in 00:{{ timeLimit }}</p>
            <p v-else class="text-primary">Otp Will be Expired in 00:0{{ timeLimit }}</p>
            <div class="d-flex flex-row justify-center align-center "><v-btn @click="cancelTicket"></v-btn></div>
        </div>
    </v-card>
</v-dialog>
<v-dialog v-model="isShowConfirmationModal" width="auto">
<v-card width="600px" class="pa-5">
    <div><v-icon @click="isShowConfirmationModal=false">mdi-close</v-icon></div>
    <div class="d-flex flex-row justify-center align-center">
    <p class="text-center">Are you sure you want to cancel ticket</p>
    </div>
    <div class="d-flex flex-row justify-center align-center ga-5"><v-btn variant="outlined" color="deep-orange-darken-2" @click="showAlert">Yes</v-btn>
        <v-btn variant="outlined" color="deep-orange-darken-2" @click="isShowConfirmationModal=false">No</v-btn></div>

     </v-card>
</v-dialog>
<v-dialog v-model="isShowAlert" width="auto">
    <v-card width="600px" class="pa-5">
        <div><v-icon @click="isShowAlert=false">mdi-close</v-icon></div>
        <div class="d-flex flex-row justify-center align-center">
            <p class="text-center">Otp will be shared on your register email , Please enter the OTP to cancel your ticket</p>
        </div>
        <div class="d-flex flex-row justify-center align-center"><v-btn variant="outlined" color="deep-orange-darken-2" @click="generateOtp">Ok</v-btn></div>
    </v-card>
</v-dialog>
<v-dialog v-model="isShowAlertMsg" width="auto">
    <v-card width="600px" class="pa-5">
    <div><v-icon @click="isShowAlertMsg=false">mdi-close</v-icon></div>
    <div class="d-flex flex-row justify-center align-center"><p :class="isDanger?'text-red':'text-success'" class="text-center">{{ alertMsg }}</p></div>
    </v-card>
</v-dialog>
</template>
<script setup>
import { onMounted , computed, watch, ref} from "vue";
import {useStore} from "vuex";
const store  = useStore();
const isViewTicket = ref(false);
const isShowOtpModal = ref(false);
const isShowAlert = ref(false);
const isShowAlertMsg = ref(false);
const isShowConfirmationModal = ref(false);
const otp = ref(null);
const ticketToBeCanceled = ref({});
const alertMsg = ref(null);
const isDanger=ref(false);
const timeLimit = ref(60);
const bookedTickets = computed(()=>{
    return store.state.users.bookedTickets;
});
const cancelTicket = async ()=>{
    const result = await store.dispatch("triggerCancelBookedTicket",{ticket:ticketToBeCanceled.value,otp:otp.value});
    console.log(result);
    if(result.status==201){
        if(result.data==true){
            await store.dispatch("triggerGetBookedTickets");
            isShowAlertMsg.value=true;
            alertMsg.value="Your Ticket has been cancelled successfully"
            isDanger.value=false;
            isShowOtpModal.value=false;

        }else{
        isShowAlertMsg.value=true;
            alertMsg.value="Invalid Otp"
            isDanger.value=true;
    }
    }
}

const showConfirmationModal =async (ticket)=>{
  ticketToBeCanceled.value = ticket;
  isShowConfirmationModal.value=true;
}
const ticketDetails = ref([]);
const viewTicket = async (ticketId)=>{
    ticketDetails.value = bookedTickets.value.filter((ticket)=>{return ticket.ticketDetail.ticketId==ticketId})
    isViewTicket.value=true;
}

const showAlert = ()=>{
    isShowConfirmationModal.value=false;
    isShowAlert.value = true;
}

const generateOtp = async  ()=>{
    const result = await store.dispatch("triggerGenerateOptToCancelTicket",{ticketId:ticketToBeCanceled.value.ticketDetail.ticketId});
    if(result.status==201){
        isShowAlert.value=false;
        isShowOtpModal.value=true;
    }
}

watch(isShowOtpModal,()=>{
if(isShowOtpModal.value){
  timeLimit.value=60;
  setInterval(()=>{
    if(timeLimit.value>0){
      timeLimit.value--;
    }
  },1000);
  if(timeLimit.value==0){
    isShowOtpModal.value=false;
  }
}
})
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