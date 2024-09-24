<template>
  <v-app>
    <template v-if="token != null">
      <Header class="header" />
    </template>
    <v-main class="scrollable">
      <router-view></router-view>
    </v-main>
    <template v-if="token != null">
      <Navbar class="footer" />
    </template>
  </v-app>
</template>

<script setup>
import Navbar from "./components/GeneralComponents/navbar.vue";
import Header from "./components/GeneralComponents/header.vue";
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
<style scoped>
.header{
top:0;
width: 100%;
position: relative;
}
.footer{
  bottom:0;
  width:100%;
  position: fixed;
}
.scrollable{
  overflow-y: auto;
  max-height: 100vh;
}
</style>
