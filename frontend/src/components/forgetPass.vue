<template>
     <div class="d-flex flex-column justify-center align-center mainDiv">
    <h1 class="text-center">Reset Password</h1>
    <v-card
      width="1000px"
      class="pa-5"
      style="border: 2px solid rgb(246, 126, 83); margin-top:100px"
    >
      <v-text-field
        label="Email"
        color="deep-orange-darken-1"
        v-model="forgetPassData.email"
        :disabled="isDisabled"
      ></v-text-field>
      <div class="d-flex flex-row justify-center align-center">
        <v-btn variant="outlined" color="green" @click="send" v-if="!isDisabled"
          >Send</v-btn
        >
      </div>
      <div v-show="allowReset">
        <v-text-field
        label="Password"
        :type="isShowPassword?'password':'text'"
        color="deep-orange-darken-1"
        v-model="forgetPassData.password"
        :append-inner-icon="isShowPassword?'mdi-eye':'mdi-eye-off'"
        @click:append-inner="isShowPassword=!isShowPassword"
      ></v-text-field>
      <div class="d-flex flex-row justify-center align-center"> 
         <v-btn variant="outlined" color="green" @click="resetPass"
          >Reset</v-btn
        ></div>
      </div>
    </v-card>
  </div>
</template>
<script setup>
import {ref,reactive} from "vue";
import {useRouter} from "vue-router";
import {axiosGet,axiosPost} from "../services/service";
const allowReset = ref(false);
const isDisabled = ref(false);
const isShowPassword =ref(false);
const forgetPassData = reactive({
email:null,
password:null,
});
const router = useRouter();
const userId = ref(null);
const send = async ()=>{
const result = await axiosGet(`/user/getUserByEmail/?email=${forgetPassData.email}`);
if(result.status===200){
isDisabled.value=true;
allowReset.value=true;
userId.value=result.data.userId;
}
}
const resetPass = async()=>{
    const result = await axiosPost(`/user/resetPassword`,{userId:userId.value,password:forgetPassData.password});
    if(result.status==201){
     router.push({path:'/'});
    }
}
</script>
<style scoped></style>
