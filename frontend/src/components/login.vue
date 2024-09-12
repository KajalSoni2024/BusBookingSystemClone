<template>
  <div class="d-flex flex-column justify-center align-center mainDiv">
    <h1 class="text-center">Welcome</h1>
    <v-card
      width="1000px"
      class="pa-5"
      style="border: 2px solid rgb(246, 126, 83)"
    >
      <v-text-field
        label="email"
        color="deep-orange-darken-1"
        v-model="loginData.email"
        @blur="v$.email.$touch"
        :error-messages="v$.email.$errors.map((e)=>e.$message)"
      ></v-text-field>
      <v-text-field
        label="password"
        color="deep-orange-darken-1"
        v-model="loginData.password"
        @blur="v$.password.$touch"
        :error-messages="v$.password.$errors.map((e)=>e.$message)"
        :type="isShowPassword?'password':'text'"
        :append-inner-icon="isShowPassword?'mdi-eye':'mdi-eye-off'"
        @click:append-inner="isShowPassword=!isShowPassword"
      ></v-text-field>
      <div>
        <v-btn variant="outlined" color="deep-orange-darken-1" @click="login"
          >Login</v-btn
        >
      </div>
    </v-card>
    <p class="text-right text-deep-orange-darken-1" @click="forgetPass">Forgot Password?</p>
    <v-divider></v-divider>
    <div class="pa-8">
      <p class="text-center text-h5">Don't have an account ?</p>
      <p class="text-center text-deep-orange-darken-1" @click="createAccount">
        Create new Account
      </p>
    </div>
  </div>
</template>
<script setup>
import {useVuelidate} from "@vuelidate/core";
import {email, required, helpers, maxLength, minLength} from "@vuelidate/validators"
import { useRouter } from "vue-router";
import { reactive, computed,ref } from "vue";
import { useStore } from "vuex";
import { isContainsChar, isContainsDigits, isSpecialChar } from "../../public/validation.js";
const store = useStore();
const router = useRouter();
const role = computed(()=>store.state.users.role);
const isShowPassword = ref(false);
const loginData = reactive({
  email: null,
  password: null,
});

const rules = ref({
  email:{required,email},
  password:{required,
    isSpecialChar:helpers.withMessage("Password must have some special characters",isSpecialChar),
    isContainsChar:helpers.withMessage("Password should contain some characters",isContainsChar),
    isContainsDigits:helpers.withMessage("Password should contain some digits",isContainsDigits),
    maxLength:helpers.withMessage("maximum length of password should be 12",maxLength(12)),
    minLength:helpers.withMessage("minimum length of password should be 8",minLength(8))
  }
})
function createAccount() {
  router.push({ name: "Register" });
}
const v$ = useVuelidate(rules,loginData);
async function login() {
const isValid = await v$.value.$validate();
if(!isValid){
  return; 
}
  await store.dispatch("triggerSetAuth", loginData);
  if(role.value===1){
    router.push({name:"AddBusDetail"})
  }
  else if(role.value===2){
   router.push({name:"AllBuses"});
  }
  else{
    router.push({ name: "HomePage" });
  }
}

const forgetPass = ()=>{
  router.push({ path: "/forgetPass" });
}
</script>
<style scope>
.mainDiv {
  margin-top: 200px;
}
</style>
