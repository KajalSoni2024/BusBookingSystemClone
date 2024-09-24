<template>
 
  <div v-if="buses && buses?.length>0" class="d-flex flex-column justify-center align-center">
    <template v-for="bus in buses" :key="bus.busId">
      <v-card width="1000px" class="ma-8 pa-5" :elevation="12">
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
              <template v-for="route in bus.routes" :key="route.routeId">
                <div v-if="route.stopName == source">
                  <p class="text-deep-orange-darken-1 text-h6">
                    {{ route.stopName }}
                  </p>
                  <div class="d-flex flex-row ga-8">
                    <div>
                      <p>Arrival Time</p>
                      <p class="text-green">{{ route.arrivalTime }}</p>
                    </div>
                    <div>
                      <p>Departure Time</p>
                      <p class="text-green">{{ route.departTime }}</p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-for="route in bus.routes" :key="route.routeId">
                <div v-if="route.stopName == dest">
                  <p class="text-deep-orange-darken-1 text-h6">
                    {{ route.stopName }}
                  </p>
                  <div class="d-flex flex-row ga-8">
                    <div>
                      <p>Arrival Time</p>
                      <p class="text-green">{{ route.arrivalTime }}</p>
                    </div>
                    <div>
                      <p>Departure Time</p>
                      <p class="text-green">{{ route.departTime }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div>
              <v-btn v-if="bus.availableSeats<total" class="bg-amber-accent-3 text-white" disabled>Not Available</v-btn>
              <v-btn v-else class="bg-green" @click="addDetail(bus.availableSeats,bus.busId, bus.price)"
                >Proceed</v-btn
              >
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
                varaint="outlined"
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
          <v-icon @click="routeDialog = false" color="deep-orange-darken-1"
            >mdi-close</v-icon
          >

          <div
            class="d-flex flex-row align-center ga-5 pa-5"
            v-for="route in busRoutes"
            :key="route.routeId"
          >
            <v-icon size="50" color="deep-orange-darken-1">mdi-bus-stop</v-icon>
            <p class="text-h5 text-green">{{ route.stopName }}</p>
          </div>
        </v-card>
      </v-dialog>
    </template>
  </div>
  <div v-else>
    <p class="text-h5 text-red text-center mt-5">No Buses Available as per your Search</p>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const store = useStore();
const routeDialog = ref(false);
const source = ref(route.query.source);
const dest = ref(route.query.dest);
const date = ref(route.query.date);
const total = ref(route.query.total);
const busRoutes = ref([]);
const showAlert = ref(false);
const buses = computed(() => {
  return store.state.users.searchedBuses;
});

function showRoutes(routes) {
  busRoutes.value = routes;
  routeDialog.value = true;
  console.log(date.value,total.value);
}

function addDetail(totalSeats, busId, price) {
if(totalSeats>=total.value){
  router.push({
    name: "BookTicket",
    query: {
      busId: busId,
      source: source.value,
      dest: dest.value,
      price: price,
      total:total.value
    },
  });
}else{
  showAlert.value=true;
}
 
}
</script>
<style scoped></style>
