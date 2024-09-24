<template>
<v-card class="pa-5"><div class="d-flex flex-column justify-center align-center">
    <h2 class="text-red">{{statusCode}}</h2>
    <p class="text-red text-h5">{{ errorMsg }}</p>
    </div></v-card>
</template>
<script setup>
import {ref} from 'vue';
import {useRoute} from 'vue-router';
const route = useRoute();
const statusCode = ref(route.query.statusCode);
const errorMsg = ref(route.query.errorMsg);
</script>
<style scoped></style>