<template>
  <v-app>
    <template v-if="token != null">
      <Header />
    </template>
    <v-main>
      <router-view></router-view>
    </v-main>
    <template v-if="token != null">
      <Navbar />
    </template>
  </v-app>
</template>

<script setup>
import Navbar from "./components/navbar.vue";
import Header from "./components/header.vue";
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
const token = computed(() => {
  return store.state.users.token;
});

const store = useStore();
onMounted(async () => {
  const payload = {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  };
  store.commit("SET_AUTH", payload);
});
</script>
<style scoped></style>
