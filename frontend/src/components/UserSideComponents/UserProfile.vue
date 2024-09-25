<template>
<v-card class="pa-5 mainDiv
">
  <v-row>
    <v-col md="5" class="pa-5">
      <div class="d-flex flex-column justify-center align-center">
        <v-img v-if="userDetails.image==null" class="rounded-xl border-thin" width="300px" cover src="../../assets//icons/defaultUserImg.jpeg"></v-img>
        <v-img v-else class="rounded-xl border-thin" height="300px" width="300px" cover :src="`http://localhost:3000/uploads/${userDetails.image}`"></v-img>
        <div class="pa-5 d-flex flex-row justify-center align-center"><v-file-input style="display: none;" ref="selectImgInput" v-model="selectedImg"></v-file-input><v-btn color="deep-orange-darken-1" @click="triggerFileInput">Edit Profile Image</v-btn></div>
      </div>
    </v-col>
    <v-col md="7" class="pa-5">
      <v-row>
    <v-col md="2"><p>First Name :</p></v-col>
    <v-col md="10"><div class="d-flex flex-row ga-5"><v-text-field variant="solo-filled" :disabled="disableFirstName" v-model="userData.firstName"></v-text-field><v-icon :color="disableFirstName?'deep-orange-darken-1':'secondary'" @click="disableFirstName=!disableFirstName">mdi-pencil</v-icon></div></v-col>
  </v-row>
  <v-row>
    <v-col md="2"><p>Last Name :</p></v-col>
    <v-col md="10"><div class="d-flex flex-row ga-5"><v-text-field variant="solo-filled" :disabled="disableLastName" v-model="userData.lastName"></v-text-field><v-icon :color="disableLastName?'deep-orange-darken-1':'secondary'" @click="disableLastName=!disableLastName">mdi-pencil</v-icon></div></v-col>
  </v-row>
  <v-row>
    <v-col md="2"><p>Email :</p></v-col>
    <v-col md="10"><div class="d-flex flex-row ga-5"><v-text-field variant="solo-filled" :disabled="true" v-model="userData.email"></v-text-field></div></v-col>
  </v-row>
  <v-row>
    <v-col md="2"><p>Register As :</p></v-col>
    <v-col md="10"><div class="d-flex flex-row ga-5"><v-text-field variant="solo-filled" :disabled="true" model-value="User"></v-text-field></div></v-col>
  </v-row>
  <v-row>
    <v-col md="2"><p>Contact :</p></v-col>
    <v-col md="10"><div class="d-flex flex-row ga-5"><v-text-field variant="solo-filled" :disabled="disableContact" v-model="userData.contact"></v-text-field><v-icon :color="disableContact?'deep-orange-darken-1':'secondary'" @click="disableContact=!disableContact">mdi-pencil</v-icon></div></v-col>
  </v-row>
  <div v-if="!disableContact||!disableFirstName||!disableLastName" class="d-flex flex-row justify-center align-center"><v-btn color="deep-orange-darken-1" @click="updateUserDetails">Update</v-btn></div>
    </v-col>
  </v-row>
  <v-divider></v-divider>
 <div class="mt-5">
  <v-table
    height="500px"
    fixed-header
  >
    <thead>
      <tr>
        <th class="text-center">
          Bus Name
        </th>
        <th class="text-center">
          Bus No.
        </th>
        <th class="text-center">
          Journey Date
        </th>
        <th class="text-center">
          Source
        </th>
        <th class="text-center">
          Destination
        </th>
        <th class="text-center">
          Total Passengers
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="ticket in userDetails?.tickets"
        :key="ticket.ticketId"
      >
        <td class="text-center">{{ ticket?.busDetail?.busName }}</td>
        <td class="text-center">{{ ticket?.busDetail?.busNo }}</td>
        <td class="text-center">{{ ticket?.ticketDate }}</td>
        <td class="text-center">{{ ticket?.source }}</td>
        <td class="text-center"> {{ ticket?.destination }}</td>
        <td class="text-center">{{ ticket?.passengers?.length }}</td>
      </tr>
    </tbody>
  </v-table>
 </div>
</v-card>
</template>
<script setup>
import { onMounted,ref, computed ,watch} from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const userDetails = ref({});
const disableFirstName =  ref(true);
const disableLastName = ref(true);
const disableContact = ref(true);
const selectImgInput = ref(null);
const selectedImg = ref(null);
const userData = computed(()=>{
  return {
   userId:userDetails.value?.userId||null,
  firstName:userDetails.value?.firstName||null,
  lastName:userDetails.value?.lastName||null,
  email:userDetails.value?.email||null,
  contact:userDetails.value?.contact||null
  }
});

const updateUserDetails =async ()=>{
  const result = await store.dispatch("triggerUpdateUserDetails",userData.value);
  if(result.status==201){
    disableFirstName.value=true;
    disableLastName.value=true;
    disableContact.value=true;
  }
  console.log(result);
}

const triggerFileInput =async ()=>{
  selectImgInput.value.click();
  console.log("selected image value ",selectedImg.value);
  
}

watch(selectedImg, async()=>{
  if(selectedImg.value!=''){
    const formData = new FormData();
    formData.append('file',selectedImg.value);
    const result = await store.dispatch("triggerUploadUserImg",formData);
    console.log(result);
    userDetails.value = await store.dispatch("triggerGetLoggedInUserDetail");
  }
})

onMounted(async ()=>{
  userDetails.value = await store.dispatch("triggerGetLoggedInUserDetail");
  console.log(userDetails.value);
})
</script>
<style scoped>
 .mainDiv{
  margin-top: 100px;
 }
</style>