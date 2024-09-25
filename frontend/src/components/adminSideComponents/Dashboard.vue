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
          <p class="text-center">Total Passengers Traveled Today</p>
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
          <p class="text-center">Total Tickets Cancelled Today</p>
        </div>
      </div>
    </v-card>
  </div>
  <div class="ml-5">
    <div
      class="d-flex flex-row justify-center align-center ga-5"
      style="width: 100%"
    >
      <v-card
        v-if="isLoaded"
        class="pa-5 d-flex flex-row justify-center align-center"
        :elevation="12"
        style="width: 40%; height: 400px"
      >
        <Bar id="my-chart-id" :options="barChartOptions" :data="barChartData"
      /></v-card>
      <v-card
        v-if="isLoaded"
        class="pa-5 d-flex flex-row justify-center align-center"
        :elevation="12"
        style="width: 40%; height: 400px"
      >
        <Line :options="lineChartOptions" :data="lineChartData" />
      </v-card>
    </div>
    <div
      class="d-flex flex-row justify-center align-center mt-5 ga-5"
      style="width: 100%"
    >
      <v-card
        class="pa-5 d-flex flex-column justify-center align-center"
        :elevation="12"
        style="width: 40%; height: 400px"
        v-if="isLoaded"
      >
        <p class="text-center">Total Buses Running Per state</p>
        <Pie :option="{ responsive: true }" :data="pieChartData"
      /></v-card>
      <v-card
        class="pa-5 d-flex flex-row justify-center align-center"
        :elevation="12"
        style="width: 40%; height: 400px"
        v-if="isLoaded"
      >
        <Line
          :options="{ responsive: true }"
          :data="lineChartDataForTicketsCancelled"
        />
      </v-card>
    </div>
  </div>
  <div class="d-flex flex-column align-center ma-5">
    <p class="text-h6 text-center">Recently Registered Users</p>
    <v-table height="200px" width="800px" fixed-header>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Email</th>
          <th class="text-left">Gender</th>
          <th class="text-left">Contact</th>
          <th class="text-left">Registered On</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in recentlyRegisteredUser" :key="user.userId">
          <td>{{ user?.firstName }} {{ user?.lastName }}</td>
          <td>{{ user?.email }}</td>
          <td>{{ user?.gender }}</td>
          <td>{{ user?.contact }}</td>
          <td>{{ getLocalDataTime(user?.createdAt) }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { onMounted, ref, reactive, watch } from "vue";
import { Bar, Line, Pie } from "vue-chartjs";
import Pusher from "pusher-js";
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
const userRegistrationDateForFullYear = ref([
  { month: 1, total: 0 },
  { month: 2, total: 0 },
  { month: 3, total: 0 },
  { month: 4, total: 0 },
  { month: 5, total: 0 },
  { month: 6, total: 0 },
  { month: 7, total: 0 },
  { month: 8, total: 0 },
  { month: 9, total: 0 },
  { month: 10, total: 0 },
  { month: 11, total: 0 },
  { month: 12, total: 0 },
]);
const userRegistrationRecord = ref([]);
const passengersTraveledRecord = ref([]);
const passengersTraveledPerMonth = ref([
  { month: 1, total: 0 },
  { month: 2, total: 0 },
  { month: 3, total: 0 },
  { month: 4, total: 0 },
  { month: 5, total: 0 },
  { month: 6, total: 0 },
  { month: 7, total: 0 },
  { month: 8, total: 0 },
  { month: 9, total: 0 },
  { month: 10, total: 0 },
  { month: 11, total: 0 },
  { month: 12, total: 0 },
]);
const recentlyRegisteredUser = ref([]);
const busesPerStateRecord = ref([]);
const totalTicketsCancelledRecord = ref([]);
const ticketsCancelledPerMonth = ref([
  { month: 1, total: 0 },
  { month: 2, total: 0 },
  { month: 3, total: 0 },
  { month: 4, total: 0 },
  { month: 5, total: 0 },
  { month: 6, total: 0 },
  { month: 7, total: 0 },
  { month: 8, total: 0 },
  { month: 9, total: 0 },
  { month: 10, total: 0 },
  { month: 11, total: 0 },
  { month: 12, total: 0 },
]);
const barChartData = reactive({
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
      data: null,
      backgroundColor: "#41B883",
    },
  ],
});
const lineChartDataForTicketsCancelled = reactive({
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
      label: ` per month in  ${new Date().getFullYear()}`,
      data: null,
      backgroundColor: "#41B123",
    },
  ],
});
const barChartOptions = ref({
  responsive: true,
});

const lineChartOptions = ref({
  responsive: true,
});
const lineChartData = reactive({
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
      data: null,
      backgroundColor: "#41B883",
    },
  ],
});

const pieChartData = ref({
  labels: [],
  datasets: [
    { label: "Total Buses running Per State", data: [], backgroundColor: [] },
  ],
});
const getLocalDataTime = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleString();
};

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

watch(userRegistrationRecord, () => {
  userRegistrationRecord.value.forEach((record) => {
    userRegistrationDateForFullYear.value.forEach((months) => {
      if (record.month == months.month) {
        months.total = parseInt(record.totalUsers);
      }
    });
  });
  barChartData.datasets[0].data = userRegistrationDateForFullYear.value.map(
    (data) => data.total
  );
});

watch(passengersTraveledRecord, () => {
  passengersTraveledRecord.value.forEach((record) => {
    passengersTraveledPerMonth.value.forEach((months) => {
      if (record.month == months.month) {
        months.total = parseInt(record.count);
      }
    });
  });
  lineChartData.datasets[0].data = passengersTraveledPerMonth.value.map(
    (data) => data.total
  );
});

watch(busesPerStateRecord, () => {
  busesPerStateRecord.value.forEach((record) => {
    pieChartData.value.labels.push(record.state);
    pieChartData.value.datasets[0].data.push(parseInt(record.count));
    pieChartData.value.datasets[0].backgroundColor.push(getRandomColor());
  });
});

watch(totalTicketsCancelledRecord, () => {
  totalTicketsCancelledRecord.value.forEach((record) => {
    ticketsCancelledPerMonth.value.forEach((months) => {
      if (record.month == months.month) {
        months.total = parseInt(record.count);
      }
    });
  });
  lineChartDataForTicketsCancelled.datasets[0].data =
  ticketsCancelledPerMonth.value.map((data) =>
     {return data.total})
})
onMounted(async () => {
  const pusher = new Pusher("5255d55b22b71ccf514f", { cluster: "ap2" });
  totalUsers.value = await store.dispatch("triggerGetTotalUsers");
  totalBuses.value = await store.dispatch("triggerGetTotalBuses");
  totalPeopleTraveled.value = await store.dispatch(
    "triggerGetTotalPeopleTraveled"
  );
  totalCancelledTickets.value = await store.dispatch(
    "triggerGetTotalCancelledTickets"
  );
  totalTicketsCancelledRecord.value = await store.dispatch(
    "triggerGetTotalTicketsCancelledPerMonth"
  );
  console.log("totalTicketsCancelledRecord",totalTicketsCancelledRecord.value);
  recentlyRegisteredUser.value = await store.dispatch(
    "triggerGetRecentlyRegisteredUser"
  );
  userRegistrationRecord.value = await store.dispatch(
    "triggerGetUsersRegisteredPerMonth"
  );
  console.log(userRegistrationRecord.value);
  passengersTraveledRecord.value = await store.dispatch(
    "triggerGetPassengersTraveledPerMonth"
  );
  console.log("passengers travelled Per month",passengersTraveledRecord);
  busesPerStateRecord.value = await store.dispatch(
    "triggerGetTotalBusesPerState"
  );
  pusher.subscribe("newBusAdded");
  pusher.bind("busData", async () => {
    totalBuses.value = await store.dispatch("triggerGetTotalBuses");
    busesPerStateRecord.value = await store.dispatch(
      "triggerGetTotalBusesPerState"
    );
  });
  pusher.subscribe("newUserRegistered");
  pusher.bind("userData", async () => {
    totalUsers.value = await store.dispatch("triggerGetTotalUsers");
    recentlyRegisteredUser.value = await store.dispatch(
      "triggerGetRecentlyRegisteredUser"
    );
    userRegistrationRecord.value = await store.dispatch(
      "triggerGetUsersRegisteredPerMonth"
    );
  });
  pusher.subscribe("newTicketBooked");
  pusher.bind("ticketData", async () => {
    totalPeopleTraveled.value = await store.dispatch(
      "triggerGetTotalPeopleTraveled"
    );

    passengersTraveledRecord.value = await store.dispatch(
      "triggerGetPassengersTraveledPerMonth"
    );
  });

  pusher.subscribe("ticketCancelled");
  pusher.bind("isCancelled",async ()=>{
    totalCancelledTickets.value = await store.dispatch(
    "triggerGetTotalCancelledTickets"
  );
  totalTicketsCancelledRecord.value = await store.dispatch(
    "triggerGetTotalTicketsCancelledPerMonth"
  );
  })
  isLoaded.value = true;
});
</script>
