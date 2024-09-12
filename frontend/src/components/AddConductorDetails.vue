
<template>
   <div v-if="busesWithoutConductors?.length>0">
    <div v-for="bus in busesWithoutConductors" :key="bus.id">
      <v-card class="ma-5">
        <v-row>
          <v-col md="1"
            ><v-img
              max-height="180px"
              max-width="100px"
              src="../../public/bus.jpg"
            ></v-img
          ></v-col>
          <v-col>
            <p>
              <span class="font-weight-bold text-h6">Bus Name :</span>
              {{ bus.busName }}
            </p>
            <p>
              <span class="font-weight-bold text-h4>">Bus No. </span
              >{{ bus.busNo }}
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            ><v-btn
              class="ma-3 float-right bg-yellow-darken-4"
              @click="showConductorDetailModal(bus.busId)"
              >Add Conductor Details</v-btn
            ></v-col
          >
        </v-row>
      </v-card>
    </div>
  </div>
  <div v-else>
<p class="text-center text-h4 text-red mt-4">No buses Without Conductor</p>
  </div>
  <v-dialog v-model="showModal" width="auto">
    <v-card width="1200px" class="pa-5">
      <div><v-icon class="float-right" @click="showModal=false">mdi-close</v-icon></div>
      <v-form>
        <div>
          <H2>Driver's Detail</H2>
          <v-row>
            <v-col>
              <div class="d-flex flex-column">
                <p>Name</p>
                <v-select
                  :items="drivers"
                  item-title="firstName"
                  item-value="userId"
                  placeholder="Enter Driver's Name"
                  color="deep-orange-darken-1" 
                  v-model="driverId"
                ></v-select>
              </div>
            </v-col>
            <v-col>
              <div class="d-flex flex-column">
                <p>cond_gender</p>
                <v-radio-group
                  inline
                  v-model="selectedDriver.gender"
                  disabled
                >
                  <v-radio label="Male" color="deep-orange-darken-1"  value="male"></v-radio>
                  <v-radio label="Female" color="deep-orange-darken-1"  value="female"></v-radio>
                  <v-radio label="Others" color="deep-orange-darken-1"  value="others"></v-radio>
                </v-radio-group>
              </div>
            </v-col>
            <v-col>
              <div class="d-flex flex-column">
                <p>Contact</p>
                <v-text-field
                  placeholder="Enter Driver's Contact"
                  v-model="selectedDriver.contact"
                  color="deep-orange-darken-1" 
                  disabled
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
              :items="conductors"
              item-value="userId"
                item-title="firstName"
                placeholder="Enter Conductors's Name"
                color="deep-orange-darken-1" 
               v-model="conductorId"
              ></v-select>
            </div>
            </v-col>
           <v-col>
            <div class="d-flex flex-column justify-center">
              <p>cond_gender</p>
              <v-radio-group inline disabled
                v-model="selectedConductor.gender">
                <v-radio label="Male" color="deep-orange-darken-1"  value="male"></v-radio>
                <v-radio label="Female" color="deep-orange-darken-1"  value="female"></v-radio>
                <v-radio label="Others" color="deep-orange-darken-1"  value="others"></v-radio>
              </v-radio-group>
            </div>
           </v-col>
          <v-col>
            <div class="d-flex flex-column justify-center">
              <p>Contact</p>
              <v-text-field
                placeholder="Enter Driver's Contact"
                v-model="selectedConductor.contact"
                color="deep-orange-darken-1" 
                disabled
              ></v-text-field>
            </div>
          </v-col>
          </v-row>
        </div>
        <div></div>
        <div class="d-flex flex-row justify-center align-center">
          <v-btn @click="addConductorDetails">Add Details</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showAlert" width="auto">
  <v-card width="500px" class="pa-5">
    <div><v-icon @click="showAlert=false" class="float-right">mdi-close</v-icon></div>
    <div class="d-flex flex-row justify-center align-center"><p>Conductors details has been added successfully</p></div>
  </v-card>
  </v-dialog>

</template>
<script setup>
import {onMounted,ref,computed,watch} from "vue";
import {useStore} from "vuex";
const conductors = ref([]);
const drivers = ref([]);
const showModal = ref(false);
const selectedConductor = ref({});
const selectedDriver = ref({});
const store = useStore();
const busesWithoutConductors = computed(()=>{
  return store.state.users.busesWithoutConductors;
})
const showAlert = ref(false);
const busId = ref(null);
const conductorId = ref(null);
const driverId = ref(null);

const showConductorDetailModal = (id)=>{
  busId.value = id;
  showModal.value = true;
}
watch(conductorId ,async()=>{
    selectedConductor.value = await store.dispatch("triggerGetUserById",{userId:conductorId.value});
})

watch(driverId, async()=>{
  selectedDriver.value = await store.dispatch("triggerGetUserById",{userId:driverId.value});
})

const addConductorDetails = async ()=>{
 const result = await store.dispatch("triggerAddConductorDetail",{busId:busId.value,conductorId:conductorId.value,driverId:driverId.value});
 if(result.status==201){
  showModal.value=false;
  showAlert.value=true;
 }
}
onMounted(async ()=>{
  await store.dispatch("triggerGetBusesWithoutConductors");
  conductors.value = await store.dispatch("triggerGetListOfConductors");
  drivers.value = await store.dispatch("triggerGetListOfDrivers");
  console.log(busesWithoutConductors.value);
})
</script>
<style scoped></style>