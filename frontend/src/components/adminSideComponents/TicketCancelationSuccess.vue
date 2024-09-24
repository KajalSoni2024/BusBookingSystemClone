<template>
<div class="d-flex flex-row justify-center align-center ma-5 pa-5">
    <v-card class="pa-3" style="border:2px solid green">
        <div class="d-flex flex-row justify-center align-center mt-5">
            <v-icon color="green" size="x-large">mdi-check-circle</v-icon>
        </div>
    <h2 class="text-center">Transaction has been Done Successfully</h2>
     <p>Refund has been transacted to the registered user's account</p>
    </v-card>
</div>
</template>
<script setup>
import {useRoute } from "vue-router";
import { useStore } from "vuex";
import {onMounted,ref} from "vue"
const route = useRoute();
const store = useStore();
const ticketId = ref(route.query.ticketId);
onMounted(async()=>{
    const result = await store.dispatch("triggerSetRefundStatusSuccess",{ticketId:ticketId.value});
    console.log(result);
})

</script>