<template>
    <v-dialog v-modal="showModal" width="auto">
        <v-card width="500px" :elevation="16">
            <div class="float-right"><v-btn @click="closeModal"></v-btn></div>
            <v-card-text :class="(type==='success'?'text-green':'text-red')">{{ props.msg}}</v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup>
import {defineProps, defineEmits, onMounted, ref} from "vue";
const props = defineProps(['isShow','msg','type']);
const emits = defineEmits(['onClose']);
const closeModal = ()=>{
    emits('onClose')
}
const showModal = ref(true)
onMounted(()=>{
console.log("props.isShow ", props.isShow)
})
</script>
<style scoped></style>