<template>
      <v-card class="pa-5 mainDiv
">
  <v-row>
    <v-col md="5" class="pa-5">
      <div class="d-flex flex-column justify-center align-center">
        <v-img v-if="userDetails?.image===null" class="rounded-xl border-thin" width="300px" cover src="../../assets//icons/defaultUserImg.jpeg"></v-img>
        <v-img v-else class="rounded-xl border-thin" width="300px" cover :src="`http://localhost:3000/uploads/${userDetails.image}`"></v-img>
        <div class="pa-5 d-flex flex-row justify-center align-center"><v-file-input style="display: none;" ref="selectImgInput" v-model="selectedImg"></v-file-input><v-btn color="deep-orange-darken-1" @click="triggerFileInput">Edit Profile Image</v-btn></div>
      </div>
    </v-col>
    <v-col md="7" class="pa-5">
      <v-row>
    <v-col md="2"><p>First Name</p></v-col>
    <v-col md="10"><div class="d-flex flex-row ga-5"><v-text-field variant="solo-filled" :disabled="disableFirstName" v-model="userData.firstName"></v-text-field><v-icon :color="disableFirstName?'deep-orange-darken-1':'secondary'" @click="disableFirstName=!disableFirstName">mdi-pencil</v-icon></div></v-col>
  </v-row>
  <v-row>
    <v-col md="2"><p>Last Name</p></v-col>
    <v-col md="10"><div class="d-flex flex-row ga-5"><v-text-field variant="solo-filled" :disabled="disableLastName" v-model="userData.lastName"></v-text-field><v-icon :color="disableLastName?'deep-orange-darken-1':'secondary'" @click="disableLastName=!disableLastName">mdi-pencil</v-icon></div></v-col>
  </v-row>
  <v-row>
    <v-col md="2"><p>Email</p></v-col>
    <v-col md="10"><div class="d-flex flex-row ga-5"><v-text-field variant="solo-filled" :disabled="true" v-model="userData.email"></v-text-field></div></v-col>
  </v-row>
  <v-row>
    <v-col md="2"><p>Contact</p></v-col>
    <v-col md="10"><div class="d-flex flex-row ga-5"><v-text-field variant="solo-filled" :disabled="disableContact" v-model="userData.contact"></v-text-field><v-icon :color="disableContact?'deep-orange-darken-1':'secondary'" @click="disableContact=!disableContact">mdi-pencil</v-icon></div></v-col>
  </v-row>
  <div v-if="!disableContact||!disableFirstName||!disableLastName" class="d-flex flex-row justify-center align-center"><v-btn color="deep-orange-darken-1" @click="updateUserDetails">Update</v-btn></div>
    </v-col>
  </v-row>
  </v-card>
</template>
<script setup>
import { onMounted,ref, computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const userDetails = ref({})
const userData = computed(()=>{
    return {
        firstName: userDetails.value?.firstName||null,
        lastName: userDetails.value?.lastName||null,
        email: userDetails.value?.email||null,
        contact: userDetails.value?.contact||null
    }
})
onMounted(async()=>{
 userDetails.value = await store.dispatch("triggerGetLoggedInUserDetail");
  
})
</script>
<style scoped></style>