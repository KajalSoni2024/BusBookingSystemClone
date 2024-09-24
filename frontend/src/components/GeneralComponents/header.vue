<template>
  <v-toolbar extended height="50">
    <div class="pa-5">
      <v-icon size="50">mdi-bus-multiple</v-icon>
    </div>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon @click="logout" size="40">mdi-account-circle</v-icon>
    </v-btn>
  </v-toolbar>
</template>
<script setup>
import { useStore } from "vuex";
import { axiosGet } from "@/services/service";
import {useRouter} from "vue-router";
const store = useStore();
const router = useRouter()
async function logout() {
  const result = await axiosGet("/user/logout");
  console.log(result);
  if (result.status == 200) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    await store.dispatch("triggerResetAuth");
    router.push({path:'/'});
  }
}
</script>
<style scoped></style>
