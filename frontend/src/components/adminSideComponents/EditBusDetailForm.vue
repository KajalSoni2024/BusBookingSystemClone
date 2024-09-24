<template>
<div class="d-flex flex-row align-center justify-center" style="margin-top:100px">
    <v-card   width="1000px"
      class="pa-5"
      style="border: 3px solid rgb(246, 126, 83)">
    <v-form>
        <v-text-field label="Bus Name" color="deep-orange-darken-1" v-model="updatedBusDetails.busName" ></v-text-field>
        <v-text-field label="Bus Number"  color="deep-orange-darken-1"  v-model="updatedBusDetails.busNo"></v-text-field>
        <v-text-field label="Total Seats"  color="deep-orange-darken-1" v-model="updatedBusDetails.totalSeats" ></v-text-field>
        <v-text-field label="Price"  color="deep-orange-darken-1" v-model="updatedBusDetails.price"></v-text-field>
        <div class="d-flex flex-row justify-center align-center ga-2">
            <v-btn variant="outlined" color="deep-orange-darken-1" @click="updateBusDetails" >Add Details</v-btn>
            <v-btn variant="outlined" color="deep-orange-darken-1" @click="showConductorForm=true">Edit HelpLine Details</v-btn>
            <v-btn variant="outlined" color="deep-orange-darken-1" @click="showRouteForm=true" >Edit Route Details</v-btn>
        </div>
    </v-form> 
    </v-card>
    <v-dialog width="auto" v-model="showRouteForm">
    <v-card class="pa-5">
      <div><v-icon class="float-right" @click="showRouteForm=false">mdi-close</v-icon></div>
        <v-row v-for="route in updatedBusDetails.routes" :key="route.id">
            <v-col>
                <div class="d-flex flex-column"><div><p>Stop No</p></div><div><v-text-field color="deep-orange-darken-1" type="number" v-model="route.stopNo"></v-text-field></div></div>
            </v-col>
            <v-col>
                <div class="d-flex flex-column"><div><p>Stop Name</p></div><div><v-text-field color="deep-orange-darken-1" v-model="route.stopName"></v-text-field></div></div>
            </v-col>
            <v-col>
                <div class="d-flex flex-column"><div><p>Arrival Time</p></div><div><v-text-field color="deep-orange-darken-1" type="time" v-model="route.arrivalTime"></v-text-field></div></div>
            </v-col>
            <v-col>
                <div class="d-flex flex-column"><div><p>Departure Time</p></div><div><v-text-field color="deep-orange-darken-1" type="time" v-model="route.departTime"></v-text-field></div></div>
            </v-col>
        </v-row>
        <div class="float-right pa-5">
            <v-btn variant="outlined" @click=addRow>+</v-btn>
        </div>
        <div class="d-flex flex-row justify-center align-center"><v-btn variant="outlined" color="deep-orange-darken-1" @click="updateRouteDetails">Add Routes</v-btn></div>
    </v-card>
</v-dialog>
<v-dialog width="auto" v-model="showConductorForm">
    <v-card width="1200px" class="pa-5">
      <div>
        <v-icon class="float-right" @click="showConductorForm=false">mdi-close</v-icon>
      </div>
      <v-form>
        <div>
          <H2>Driver's Detail</H2>
          <v-row>
            <v-col>
              <div class="d-flex flex-column">
                <p>Name</p>
                <v-select
                  placeholder="Enter Driver's Name"
                  color="deep-orange-darken-1"
                  :items="drivers"
                  item-title="firstName"
                  item-value="userId"
                  v-model="selectedDriver.userId"
                ></v-select>
              </div>
            </v-col>
            <v-col>
              <div class="d-flex flex-column">
                <p>Gender</p>
                <v-radio-group
                  inline
                  disabled
                  v-model="selectedDriver.gender"
                >
                  <v-radio label="Male" color="deep-orange-darken-1" value="male"></v-radio>
                  <v-radio label="Female" color="deep-orange-darken-1" value="female"></v-radio>
                  <v-radio label="Others" color="deep-orange-darken-1" value="others"></v-radio>
                </v-radio-group>
              </div>
            </v-col>
            <v-col>
              <div class="d-flex flex-column">
                <p>Contact</p>
                <v-text-field
                  placeholder="Enter Driver's Contact"
                  color="deep-orange-darken-1"
                  disabled
                  v-model="selectedDriver.contact"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </div>
        <div>
          <h2>Conductors's Detail</h2>
          <v-row >
            <v-col>
              <div class="d-flex flex-column justify-center">
              <p>Name</p>
              <v-select
                placeholder="Enter Driver's Name"
                color="deep-orange-darken-1"
                :items="conductors"
                item-title="firstName"
                item-value="userId"
                v-model="selectedConductor.userId"
              ></v-select>
            </div>
            </v-col>
           <v-col>
            <div class="d-flex flex-column justify-center">
              <p>Gender</p>
              <v-radio-group inline disabled v-model="selectedConductor.gender">
                <v-radio color="deep-orange-darken-1" label="Male" value="male"></v-radio>
                <v-radio color="deep-orange-darken-1" label="Female" value="female"></v-radio>
                <v-radio color="deep-orange-darken-1" label="Others" value="others"></v-radio>
              </v-radio-group>
            </div>
           </v-col>
          <v-col>
            <div class="d-flex flex-column justify-center">
              <p>Contact</p>
              <v-text-field
                placeholder="Enter Driver's Contact"
                color="deep-orange-darken-1"
                disabled
                v-model="selectedConductor.contact"
              ></v-text-field>
            </div>
          </v-col>
          
          </v-row>
        </div>
        <div></div>
        <div class="d-flex flex-row justify-center align-center">
          <v-btn color="deep-orange-darken-1" variant="outlined" @click="updateConductorDetails">Add Details</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
  <v-dialog width="auto" v-model="showAlert">
    <v-card width="800px" class="pa-5">
      <div><v-icon class="float-right" @click="showAlert=false">mi-close</v-icon></div>
        <div><p class="">{{ message }}</p></div>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showNoDetailsAvailableAlert" width="auto">
    <v-card width="800px" class="pa-5">
      <div>
        <v-icon class="float-right" color="red" @click="showNoDetailsAvailableAlert=false" icon="mdi-close"></v-icon>
      </div>
<div class="d-flex flex-column justify-center align-center pa-5">
<p class="text-center">Conductors Details not yet added</p>
<div class="d-flex flex-row justify-center align-center mt-5"><v-btn variant="outlined" @click="showNoDetailsAvailableAlert=false" color="deep-orange-darken-1">Ok</v-btn></div>
</div>
    </v-card>
  </v-dialog>
</div>
</template>
<script setup>
import {onMounted,ref, computed, watch} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
const store = useStore();
const route = useRoute();
const showRouteForm = ref(false);
const showConductorForm = ref(false);
const message = ref(null);
const showAlert = ref(false);
const showNoDetailsAvailableAlert = ref(false);
const drivers = ref([]);
const conductors = ref([]);
const selectedDriver=ref({});
const selectedConductor = ref({});
const busDetails = computed(()=>{
return store.state.users.busDetailsById;
});
const updatedBusDetails = ref({});
const busId = ref(route.query.busId);

const updateBusDetails = async ()=>{
const updatedDetails = {busName:updatedBusDetails.value.busName,busNo:updatedBusDetails.value.busNo,totalSeats:updatedBusDetails.value.totalSeats,busId:updatedBusDetails.value.busId, price:updatedBusDetails.value.price};
console.log("updated details ",updatedDetails)
try{
  const result = await store.dispatch("triggerUpdateBusDetail",updatedDetails)
//  const result  =  await axiosPost('/updateBusDetails',updatedDetails);
 if(result.status==201){
  message.value="Bus Details Updated Successfully";
  showAlert.value=true;
 }
}catch(err){
    console.log(err);
    message.value=err.message;
}}

watch(selectedConductor,async()=>{
  selectedConductor.value = await store.dispatch("triggerGetUserById",{userId:selectedConductor.value.userId});
},{deep:true})
watch(selectedDriver,async()=>{
  selectedDriver.value = await store.dispatch("triggerGetUserById",{userId:selectedDriver.value.userId});
},{deep:true})
const updateConductorDetails=async ()=>{
try{
  const result = await store.dispatch("triggerUpdateConductorDetail",{driverId:selectedDriver.value.userId,conductorId:selectedConductor.value.userId, busId:busId.value})
// const result = await axiosPost('/updateBusConductorDetails',{conductors:conductors, busId:busId.value});
if(result.status==201){
    message.value="Conductors Details updated successfully";
    showAlert.value=true;
}
}catch(err){
    console.log(err);
    message.value=err.message;
    showAlert.value=true;
}
}
const updateRouteDetails =async ()=>{
const {routes} = updatedBusDetails.value;
try{
  const result = await store.dispatch("triggerUpdateRouteDetail",{routes:routes,busId:busId.value})
// const result  = await axiosPost('/updateBusRouteDetails',{routes:routes,busId:busId.value});
if(result.status==201){
    message.value="Route Details updated successfully";
    showAlert.value=true;
}
}catch(err){
    console.log(err);
    message.value=err.message;
    showAlert.value=true;
}
}
const addRow = ()=>{
    updatedBusDetails.value.routes.push({stopName:null,stopNo:null, arrivalTime:null,departTime:null});
}
onMounted(async ()=>{
 await store.dispatch("triggerGetBusDetailsById",{busId:busId.value});
 updatedBusDetails.value=busDetails.value;
 selectedDriver.value=busDetails.value.driver;
 selectedConductor.value=busDetails.value.conductor;
 conductors.value = await store.dispatch("triggerGetListOfConductors");
 drivers.value = await store.dispatch("triggerGetListOfDrivers");
console.log(busDetails.value);
console.log(updatedBusDetails.value);
});
</script>
<style></style>