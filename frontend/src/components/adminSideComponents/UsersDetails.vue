<template>
    <div v-if="users.length===0" class="d-flex flex-row justify-center align-center text-red text-h5 mt-5"><p>No user registered yet</p></div>
  <v-table v-else
    height="300px"
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
        <th>Tickets Booked</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="user in users"
        :key="user?.userId"
      >
        <td>{{ user?.firstName }} {{ user?.lastName }}</td>
        <td>{{ user?.email }}</td>
        <td>{{ user?.gender }}</td>
        <td>{{ user?.contact }}</td>
        <td v-if="user?.createdAt">{{ getLocalDataTime(user.createdAt) }}</td>
        <td v-if="user"><v-btn @click="viewAllTicketsBookedByUser(user?.userId,user?.tickets?.length)">View</v-btn></td>
      </tr>
    </tbody>
  </v-table>
  <v-dialog width="auto" v-model="showAlert">
    <v-card width="500px" class="pa-2">
      <div>
        <v-icon @click="showAlert=false" class="float-right">mdi-close</v-icon>
      </div>
      <div class="d-flex flex-row justify-center align-center pa-5">
        <p class="text-center text-red">User has not booked any tickets yet</p>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {useStore} from "vuex";
const store = useStore();
const router = useRouter();
const users = computed(()=>{
    return store.state.admin.allUsers;
});
const showAlert = ref(false);
const viewAllTicketsBookedByUser = (userId,totalTickets)=>{
if(totalTickets==0){
showAlert.value=true;
}else{
  router.push({name:'ListOfTickets',query:{userId:userId}});
}
}

const getLocalDataTime = (date)=>{
  const newDate = new Date(date);
  return newDate.toLocaleString(newDate);
}
onMounted(async ()=>{
await store.dispatch(`triggerGetAllUsers`);
console.log(users.value)
})
</script>
<style scoped></style>