<template>
    <div v-if="buses.length==0"><h1 class="text-h5 text-red text-center">No Buses Available</h1></div>
    <div v-else class="d-flex flex-column justify-center align-center">
        <template v-for="bus in buses" :key="bus.busId">
            <v-card v-if="bus.routes.length>0" width="1000px" class="ma-8 pa-5" :elevation="12">
        <v-row>
          <v-col md="1"
            ><v-img
              max-height="180px"
              max-width="100px"
              src="../../../public/bus.jpg"
            ></v-img
          ></v-col>
          <v-col md="6">
            <div class="pa-3">
              <p class="text-h5">{{ bus.busName }}</p>
              <p class="text-h6">HelpLine</p>
              <div class="d-flex flex-row align-center ga-5 border-thin border-primary pa-3 mt-2">
                <div class="d-flex flex-column ga-1 justify-center">
                    <h4>Driver's Detail</h4>
                <div class="d-flex flex-row  align-center ga-5"><div><b>Name</b></div><div><p>{{ bus.conductor.firstName }} {{ bus.conductor.lastName }}</p></div></div>
                <div class="d-flex flex-row  align-center ga-5"><div><b>Contact</b></div><div><p>{{ bus.conductor.contact }}</p></div></div>
                </div>
                <div class="d-flex flex-column ga-1 justify-center">
                    <h4>Conductor's Detail</h4>
                <div class="d-flex flex-row  align-center ga-5"><div><b>Name</b></div><div><p>{{ bus.driver.firstName }} {{ bus.driver.lastName }}</p></div></div>
                <div class="d-flex flex-row  align-center ga-5"><div><b>Contact</b></div><div><p>{{ bus.driver.contact}}</p></div></div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col md="5" class="pt-12">
            <div>
              <p>
                <span class="text-deep-orange-darken-1 text-h6"
                  >Available Seats : </span
                ><span class="text-green">{{ bus.availableSeats }}</span>
              </p>
            </div>
            <div>
              <p>
                <span class="text-deep-orange-darken-1 text-h6">Price : </span
                ><span class="text-green">{{ bus.price }}</span>
              </p>
            </div>
            <div>
              <v-btn
                variant="outlined"
                color="deep-orange-darken-1"
                @click="showRoutes(bus.routes)"
                >Route</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-card>
      <v-dialog width="auto" v-model="routeDialog">
        <v-card width="800px" :elevation="12" class="pa-5">
          <div>
            <v-icon class="float-right" @click="routeDialog = false" color="deep-orange-darken-1"
            >mdi-close</v-icon
          >
          </div>
         
          <div
            class="d-flex flex-row align-center ga-5 pa-5"
            v-for="route in busRoutes"
            :key="route.routeId"
          >
          <div class="d-flex flex-column justify-start">
            <div class="d-flex flex-row align-center">
            <v-icon size="50" color="deep-orange-darken-1">mdi-bus-stop</v-icon>
            <p class="text-h5 text-green">{{ route.stopName }}</p>
          </div>
         <div class="d-flex flex-row pl-2 ga-5">      <p><b>Arrival: </b>{{ route.arrivalTime }}</p>
            <p><b>Departure: </b>{{ route.departTime }}</p></div>
          </div>
          </div>
        </v-card>
      </v-dialog>
        </template>
    </div>
</template>
<script setup>
import {useStore} from "vuex";
import {onMounted, ref, computed} from "vue"
const store = useStore();
const routeDialog = ref(false)
const buses = computed(()=>{
    return store.state.users.allBuses;
});
const busRoutes = ref([]);
const showRoutes = (routes)=>{
    busRoutes.value=routes;
    routeDialog.value=true
}
onMounted(async()=>{
    await store.dispatch("triggerGetAllBuses");
    console.log("buses", buses.value)
});

</script>
<style scoped></style>
