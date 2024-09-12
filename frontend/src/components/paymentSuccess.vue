<template>
  <p></p>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { axiosPost } from "../services/service";
const route = useRoute();
const ticketId = ref(route.query.ticketId);
onMounted(async () => {
  const result = await axiosPost("/allocateSeats", {
    ticketId: ticketId.value,
  });
  console.log(result);
});
</script>
<style scoped></style>
