<template>
  <div class="d-flex flex-column justify-center align-center mainDiv">
    <h1 class="text-center">Reset Password</h1>
    <v-card
      width="1000px"
      class="pa-5"
      style="border: 2px solid rgb(246, 126, 83); margin-top: 100px"
    >
      <v-text-field
        label="Email"
        color="deep-orange-darken-1"
        v-model="forgetPassData.email"
        :disabled="isDisabled"
      ></v-text-field>
      <div class="d-flex flex-row justify-center align-center">
        <v-btn variant="outlined" color="green" @click="send" v-if="!isDisabled">
          Send Otp</v-btn
        >
      </div>
      <div v-show="allowReset">
        <v-text-field
          label="Password"
          :type="isShowPassword ? 'password' : 'text'"
          color="deep-orange-darken-1"
          v-model="forgetPassData.password"
          :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="isShowPassword = !isShowPassword"
        ></v-text-field>
        <div class="d-flex flex-row justify-center align-center">
          <v-btn variant="outlined" color="green" @click="resetPassword">
            >Send Otp</v-btn
          >
        </div>
      </div>
    </v-card>
  </div>
  <v-dialog v-model="isShowOtpModal" width="auto">
   
    <v-card class="pa-5" width="500px">
      <div>
      <v-icon class="float-right" @click="isShowOtpModal = false"
        >mdi-close</v-icon
      >
    </div>
      <v-text-field
        label="Enter Otp"
        v-model="forgetPassData.otp"
        @keyup.enter="sendOtp"
        color="deep-orange-darken-1"
      ></v-text-field>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowAlert" width="auto">
    <v-card class="pa-5" width="800px">
      <div>
        <v-icon class="float-right" @click="isShowAlert = false"
          >mdi-close</v-icon
        >
      </div>
      <div class="d-flex flex-row justify-center align-center text-red">
        <p>{{ alertMsg }}</p>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { axiosPost } from "../../services/service";
const allowReset = ref(false);
const isDisabled = ref(false);
const isShowPassword = ref(false);
const isShowOtpModal = ref(false);
const isShowAlert = ref(false);
const alertMsg = ref(false);
const forgetPassData = reactive({
  email: null,
  password: null,
  otp: null,
});
const store = useStore();
const router = useRouter();
const userId = ref(null);
const send = async () => {
  const result = await store.dispatch("triggerGetOtpForForgetPassRequest", {
    email: forgetPassData.email,
  });
  if (result.status === 200) {
    if (result.data == false) {
      isShowAlert.value = true;
      alertMsg.value = "This email is not registered";
    } else {
      isDisabled.value = true;
      isShowOtpModal.value = true;
      userId.value = result.data.userId;
    }
  }
};
const resetPassword = async () => {
  const result = await axiosPost(`/user/resetPassword`, {
    userId: userId.value,
    password: forgetPassData.password,
  });
  if (result.status == 201) {
    router.push({ path: "/" });
  }
};

const sendOtp = async () => {
  const result = await store.dispatch("triggerCheckForgetPassOtp", {
    userId: userId.value,
    otp: forgetPassData.otp,
  });
  if (result.status == 200) {
    if (result.data == true) {
      allowReset.value = true;
      isShowOtpModal.value=false;
    } else {
      isShowAlert.value = true;
      alertMsg.value = "Invalid Otp";
    }
  }
};
</script>
<style scoped></style>
