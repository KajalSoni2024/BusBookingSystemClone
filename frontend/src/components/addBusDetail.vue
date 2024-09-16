<template>
<div class="d-flex flex-row align-center justify-center" style="margin-top:100px">
    <v-card   width="1000px"
      class="pa-5"
      style="border: 3px solid rgb(246, 126, 83)">
    <v-form>
        <v-text-field label="Bus Name" color="deep-orange-darken-1" @blur="v$.busName.$touch" :error-messages="v$.busName.$errors.map((e)=>e.$message)" v-model="busDetail.busName"></v-text-field>
        <v-text-field label="Bus Number"  color="deep-orange-darken-1" @blur="v$.busNo.$touch" :error-messages="v$.busNo.$errors.map((e)=>e.$message)" v-model="busDetail.busNo"></v-text-field>
        <v-text-field label="Total Seats"  color="deep-orange-darken-1" @blur="v$.totalSeats.$touch" :error-messages="v$.totalSeats.$errors.map((e)=>e.$message)" v-model="busDetail.totalSeats"></v-text-field>
        <v-text-field label="Price"  color="deep-orange-darken-1" @blur="v$.price.$touch" :error-messages="v$.price.$errors.map((e)=>e.$message)" v-model="busDetail.price"></v-text-field>
        
        <div class="d-flex flex-row justify-center align-center">
            <v-btn @click="addBusDetail">Add Details</v-btn>
        </div>
    </v-form> 
    </v-card>
</div>
<v-dialog width="auto" v-model="showRouteForm">
    <v-card class="pa-5">
        <v-select label="State" :items="states" v-model="selectedState" item-title="state_name" item-value="state_name"></v-select>
        <v-row v-for="route in busRoutes" :key="route.id">
            <v-col>
                <div class="d-flex flex-column"><div><p>Stop No</p></div><div><v-text-field :error-messages="vRoute$.stopNo.$errors.map((e)=>e.$message)" color="deep-orange-darken-1" type="number" v-model="route.stopNo"></v-text-field></div></div>
            </v-col>
            <v-col>
                <div class="d-flex flex-column"><div><p>Stop Name</p></div><div><v-select :items="cities" item-title="city_name" item-value="city_name" :error-messages="vRoute$.stopName.$errors.map((e)=>e.$message)" color="deep-orange-darken-1" v-model="route.stopName"></v-select></div></div>
            </v-col>
            <v-col>
                <div class="d-flex flex-column"><div><p>Arrival Time</p></div><div><v-text-field  :error-messages="vRoute$.arrivalTime.$errors.map((e)=>e.$message)" color="deep-orange-darken-1" type="time" v-model="route.arrivalTime"></v-text-field></div></div>
            </v-col>
            <v-col>
                <div class="d-flex flex-column"><div><p>Departure Time</p></div><div><v-text-field :error-messages="vRoute$.departTime.$errors.map((e)=>e.$message)" color="deep-orange-darken-1" type="time" v-model="route.departTime"></v-text-field></div></div>
            </v-col>
        </v-row>
        <div class="float-right pa-5">
            <v-btn @click=addRow>Add Route</v-btn>
        </div>
        <div class="d-flex flex-row justify-center align-center"><v-btn @click="addRoutesDetails">Add Routes</v-btn></div>
    </v-card>

</v-dialog>
<AlertModal v-if="showAlert" :type="success" :msg="message" @onClose="closeAlertModal"/>
</template>
<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required,helpers} from "@vuelidate/validators";
import {reactive, ref, computed, onMounted,watchEffect} from "vue"
import AlertModal from "./AlertModal.vue"
import {useStore} from "vuex";
import { onlyChars , isVehicleNo, isOnlyDigits} from "../../public/validation";
const showAlert = ref(false);
const store = useStore();
const states = ref([]);
const cities = ref([]);
const busDetail = reactive({
    busName:null,
    busNo:null,
    totalSeats:null,
    price:null
});
const selectedState = ref('Gujarat');
const busId = ref(null);
const showRouteForm = ref(false);
const busRoutes = reactive([{id:1,stopName:null, stopNo:null,arrivalTime:null, departTime:null}]);
const rules = ref({
    busName:{required, onlyChars:helpers.withMessage("Bus name should contain only characters",onlyChars)},
    busNo:{required, isVehicle :helpers.withMessage("Incorrect bus number",isVehicleNo)},
    totalSeats:{required,isOnlyDigits:helpers.withMessage("Total seats field should contain only digits",isOnlyDigits)},
    price:{required,isOnlyDigits:helpers.withMessage("Price field should contain only digits", isOnlyDigits)}
});
const routeRules = computed(()=>{
    return {
    stopName:{required, onlyChars:helpers.withMessage("Stop name should contain only characters", onlyChars)},
    stopNo:{required},
    arrivalTime:{required},
    departTime:{required}
    }
})
const v$ = useVuelidate(rules,busDetail);
const vRoute$ = useVuelidate(routeRules,busRoutes);
const addBusDetail = async ()=>{
    const isValid = await v$.value.$validate();
    if(!isValid) return;
    const result = await store.dispatch("triggerAddBusDetail",busDetail);
// const result = await axiosPost("/addBusDetails",busDetail);
console.log(busRoutes);
console.log(result)
if(result.status==201){
busId.value=result.data.busId;
showRouteForm.value=true;
}
}
const addRow = ()=>{
    busRoutes.push({id:busRoutes.length+1,stopName:null, stopNo:null, arrivalTime:null, departTime:null});
}

const addRoutesDetails = async ()=>{
   
    const busRouteDetails = busRoutes.map((route)=>{
        return {...route, busId:busId.value}
    })
    console.log(busRouteDetails);
    try{
        const result = await store.dispatch("triggerAddBusRoute",{busRouteDetail:busRouteDetails})
        // const result = await axiosPost("/addBusRoute",{busRouteDetail:busRouteDetails});
        if(result.status==200){
            console.log(result.data);
            showRouteForm.value=false
        }
    }catch(err){
        console.log(err)
    }
}

watchEffect(async ()=>{
 const result = await store.dispatch("triggerGetCitiesByState",{state:selectedState.value});
   cities.value = result;
   console.log(cities.value);
}) 
const closeAlertModal = ()=>{
 showAlert.value=true ; 
}
onMounted(async ()=>{
  states.value = await store.dispatch("triggerGetStatesByCountry");
})
</script>
<style scoped></style>
