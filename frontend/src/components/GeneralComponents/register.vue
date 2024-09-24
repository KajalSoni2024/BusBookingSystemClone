<template>
  <div class="d-flex flex-column justify-center align-center mainDiv">
    <h1 class="text-center pa-5">Create an Account</h1>
    <v-card
      width="1000px"
      class="pa-5"
      style="border: 2px solid rgb(246, 126, 83)"
    >
      <v-text-field
        label="First Name"
        color="deep-orange-darken-1"
        v-model="userData.firstName"
        @blur="v$.firstName.$touch"
        :error-messages="v$.firstName.$errors.map((e)=>e.$message)"
      ></v-text-field>
      <v-text-field
        label="Last Name"
        color="deep-orange-darken-1"
        v-model="userData.lastName"
        @blur="v$.lastName.$touch"
        :error-messages="v$.lastName.$errors.map((e)=>e.$message)"
      ></v-text-field>
      <v-text-field
        label="Email"
        color="deep-orange-darken-1"
        v-model="userData.email"
        @blur="v$.email.$touch"
        :error-messages="v$.email.$errors.map((e)=>e.$message)"
      >
      </v-text-field>
      <v-text-field
        label="Contact"
        color="deep-orange-darken-1"
        v-model="userData.contact"
        @blur="v$.contact.$touch"
        :error-messages="v$.contact.$errors.map((e)=>e.$message)"
      ></v-text-field>
      <v-radio-group inline label="Select Gender" v-model="userData.gender" @blur="v$.gender.$touch" :error-messages="v$.gender.$errors.map((e)=>e.$message)"
        >
        <v-radio
          color="deep-orange-darken-1"
          label="Male"
          value="male"
        ></v-radio>
        <v-radio
          color="deep-orange-darken-1"
          label="Female"
          value="female"
        ></v-radio>
        <v-radio
          color="deep-orange-darken-1"
          label="Others"
          value="others"
        ></v-radio>
      </v-radio-group>
      <v-radio-group inline label="Select Role" v-model="userData.role" @blur="v$.gender.$touch" :error-messages="v$.role.$errors.map((e)=>e.$message)">
        <v-radio color="deep-orange-darken-1" label="User" value="0"></v-radio>
        <v-radio color="deep-orange-darken-1" label="Conductor" value="2"></v-radio>
        <v-radio color="deep-orange-darken-1" label="Driver" value="3"></v-radio>
        <v-radio color="deep-orange-darken-1" label="Admin" value="1"></v-radio>
      </v-radio-group>
      <v-text-field
        color="deep-orange-darken-1"
        label="Password"
        v-model="userData.password"
        @blur="v$.password.$touch"
        :error-messages="v$.password.$errors.map((e)=>e.$message)"
      ></v-text-field>
      <v-text-field
        color="deep-orange-darken-1"
        label="Confirm Password"
        v-model="userData.cpassword"
        @blur="v$.cpassword.$touch"
        :error-messages="v$.cpassword.$errors.map((e)=>e.$message)"
      ></v-text-field>
      <div class="d-flex flex-row align-center justify-center">
        <v-btn variant="outlined" color="deep-orange-darken-1" @click="register"
          >Create Account</v-btn
        >
      </div>
    </v-card>
  </div>
</template>
<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required,email,helpers,maxLength, minLength} from "@vuelidate/validators";
import { reactive,ref } from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
const store = useStore();
import {onlyChars,isSpecialChar,isFirstLetterCapital,isPhoneNumber,isContainsChar,isContainsDigits} from '../../../public/validation';
const router = useRouter()
const userData = reactive({
  firstName: null,
  lastName: null,
  gender: null,
  email: null,
  password: null,
  cpassword: null,
  role:null,
  contact: null,
});

const rules = ref({
  firstName:{required,onlyChars:helpers.withMessage("first Name should not contain numbers",onlyChars),isFirstLetterCapital:helpers.withMessage("First letter of name should be capital",isFirstLetterCapital)},
  lastName:{required,onlyChars:helpers.withMessage("last name should not contain numbers",onlyChars),isFirstLetterCapital:helpers.withMessage("First letter of name should be capital",isFirstLetterCapital)},
  gender:{required},
  email:{required,email},
  password:{required,isSpecialChar:helpers.withMessage("Password should contain some special characters",isSpecialChar),
  isContainsChar:helpers.withMessage("password should contain some letters",isContainsChar),
  isContainsDigits:helpers.withMessage("Password should contain some digits",isContainsDigits),
  maxLength:helpers.withMessage("maximum length of password should be 12 characters",maxLength(12)),
  minLength:helpers.withMessage("minimum length of password should be 8 characters",minLength(8))
},
  cpassword:{required},
  role:{required},
  contact:{required,isPhoneNumber:helpers.withMessage("Phone number should be of 10 digits",isPhoneNumber)}
});
const v$ = useVuelidate(rules,userData);
async function register() {
  const isValid =await v$.value.$validate();
  if(isValid){
    const result = await store.dispatch("triggerRegisterUser",userData);
  if (result.status == 200) {
    router.push({name:"Login"})
  }
  }
}

</script>
<style scope>
.mainDiv {
  margin-top: 100px;
}
</style>
