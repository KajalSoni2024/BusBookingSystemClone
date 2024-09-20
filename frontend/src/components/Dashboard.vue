<template>
  <div
    class="d-flex flex-row justify-center align-center ga-5 ma-5"
    style="width: 100%"
  >
    <v-card
      elevation="12"
      style="width: 20%; height: 150px"
      class="pa-5 rounded-lg bg-deep-orange-darken-1"
    >
      <div
        class="d-flex flex-row align-center justify-center mt-2"
        style="width: 100%"
      >
        <div class="d-flex flex-column justify-center ga-5" style="width: 50%">
          <v-icon size="x-large">mdi-account</v-icon>
          <p>Users</p>
        </div>
        <div class="d-flex flex-column justify-center ga-5" style="width: 50%">
          <p class="text-center">{{ totalUsers }}</p>
          <p class="text-center">Total Users</p>
        </div>
      </div>
    </v-card>
    <v-card
      elevation="12"
      style="width: 20%; height: 150px"
      class="pa-5 rounded-lg bg-light-green-darken-2"
    >
      <div
        class="d-flex flex-row align-center justify-center mt-2"
        style="width: 100%"
      >
        <div class="d-flex flex-column justify-center ga-5" style="width: 50%">
          <v-icon size="x-large">mdi-bus</v-icon>
          <p>Buses</p>
        </div>
        <div class="d-flex flex-column justify-center ga-5" style="width: 50%">
          <p class="text-center">{{ totalBuses }}</p>
          <p class="text-center">Total Buses</p>
        </div>
      </div>
    </v-card>
    <v-card
      elevation="12"
      style="width: 20%; height: 150px"
      class="pa-5 rounded-lg bg-teal-darken-1"
    >
      <div
        class="d-flex flex-row align-center justify-center mt-2"
        style="width: 100%"
      >
        <div class="d-flex flex-column justify-center ga-5" style="width: 50%">
          <v-icon size="x-large">mdi-ticket</v-icon>
          <p>Tickets</p>
        </div>
        <div class="d-flex flex-column justify-center ga-5" style="width: 50%">
          <p class="text-center">{{ totalPeopleTraveled }}</p>
          <p class="text-center">Total People Traveled</p>
        </div>
      </div>
    </v-card>
    <v-card
      elevation="12"
      style="width: 20%; height: 150px"
      class="pa-5 rounded-lg bg-light-blue-darken-4"
    >
      <div
        class="d-flex flex-row align-center justify-center mt-2"
        style="width: 100%"
      >
        <div class="d-flex flex-column justify-center ga-5" style="width: 50%">
          <v-icon size="x-large">mdi-table-cancel</v-icon>
          <p>Cancelled</p>
        </div>
        <div class="d-flex flex-column justify-center ga-5" style="width: 50%">
          <p class="text-center">{{ totalCancelledTickets }}</p>
          <p class="text-center">Total Tickets Cancelled</p>
        </div>
      </div>
    </v-card>
  </div>
  <div
    class="d-flex flex-row justify-center align-center ga-5"
    style="width: 100%"
  >
    <v-card v-if="isLoaded"
      class="pa-5 d-flex flex-row justify-center align-center"
      :elevation="12"
      style="width: 40%; height: 400px"
    >
      <Bar  id="my-chart-id" :options="pieChartOptions" :data="pieChartData"
    /></v-card>
    <v-card v-if="isLoaded"
      class="pa-5 d-flex flex-row justify-center align-center"
      :elevation="12"
      style="width: 40%; height: 400px"
    >
  <Line :options="lineChartOptions" :data="lineChartData"/>
  </v-card>
  </div>
  <div class="d-flex flex-column align-center ma-5 ">
    <p class="text-h6 text-center">Recently Registered Users</p>
    <v-table
    height="200px"
    width="800px"
    fixed-header
  >
    <thead>
      <tr>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Email
        </th>
        <th class="text-left">
          Gender
        </th>
        <th class="text-left">Contact</th>
        <th class="text-left">Registered On</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="user in recentlyRegisteredUser"
        :key="user.userId"
      >
        <td>{{ user.firstName }} {{ user.lastName }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.gender }}</td>
        <td>{{ user.contact }}</td>
        <td>{{ getLocalDataTime(user.createdAt) }}</td>
      </tr>
    </tbody>
  </v-table>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { onMounted, ref, reactive, watch} from "vue";
import { Bar,Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  DoughnutController,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  DoughnutController,
  CategoryScale,
  ArcElement,
  LineElement,
  LinearScale
);
const store = useStore();
const totalUsers = ref(null);
const totalBuses = ref(null);
const isLoaded = ref(false);
const totalPeopleTraveled = ref(null);
const totalCancelledTickets = ref(null);
const userRegistrationDateForFullYear = ref([{month:1,total:0},{month:2,total:0},{month:3,total:0},{month:4,total:0},{month:5,total:0},{month:6,total:0},{month:7,total:0},{month:8,total:0},{month:9,total:0},{month:10,total:0},{month:11,total:0},{month:12,total:0}]);
const userRegistrationRecord = ref([]);
const passengersTraveledRecord = ref([])
const passengersTraveledPerMonth =ref([{month:1,total:0},{month:2,total:0},{month:3,total:0},{month:4,total:0},{month:5,total:0},{month:6,total:0},{month:7,total:0},{month:8,total:0},{month:9,total:0},{month:10,total:0},{month:11,total:0},{month:12,total:0}]);
const recentlyRegisteredUser = ref([]);
const pieChartData = reactive({
  labels: [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: `Users registered per month in  ${new Date().getFullYear()}`,
      data:null,
      backgroundColor:"#41B883",
    },
  ],
});
const pieChartOptions = ref({
  responsive: true,
});

const lineChartOptions =  ref({
  responsive: true,
});
const lineChartData =  reactive({
  labels: [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: `Passengers Traveled per month in ${new Date().getFullYear()}`,
      data:null,
      backgroundColor:"#41B883",
    },
  ],
});

const getLocalDataTime = (date)=>{
   const newDate = new Date(date);
   return newDate.toLocaleString();
}

watch(userRegistrationRecord,()=>{
  userRegistrationRecord.value.forEach((record)=>{
      userRegistrationDateForFullYear.value.forEach((months)=>{
        if(record.month==months.month){
          months.total=parseInt(record.totalUsers);
        }
      })
  })
  pieChartData.datasets[0].data=userRegistrationDateForFullYear.value.map(data=>data.total);
})

watch(passengersTraveledRecord,()=>{
  passengersTraveledRecord.value.forEach((record)=>{
    passengersTraveledPerMonth.value.forEach((months)=>{
        if(record.month==months.month){
          months.total=parseInt(record.count);
        }
      })
  })
  lineChartData.datasets[0].data=passengersTraveledPerMonth.value.map(data=>data.total);
})
onMounted(async () => {
  totalUsers.value = await store.dispatch("triggerGetTotalUsers");
  totalBuses.value = await store.dispatch("triggerGetTotalBuses");
  totalPeopleTraveled.value = await store.dispatch(
    "triggerGetTotalPeopleTraveled"
  );
  totalCancelledTickets.value = await store.dispatch(
    "triggerGetTotalCancelledTickets"
  );
  recentlyRegisteredUser.value = await store.dispatch("triggerGetRecentlyRegisteredUser")
  userRegistrationRecord.value = await store.dispatch("triggerGetUsersRegisteredPerMonth");
  passengersTraveledRecord.value = await store.dispatch("triggerGetPassengersTraveledPerMonth")
  isLoaded.value = true;
});
</script>
