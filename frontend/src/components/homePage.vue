<template>
  <div class="mainDiv d-flex flex-column justify-center align-center">
    <v-card
      width="1000px"
      class="pa-5"
      style="border: 3px solid rgb(246, 126, 83)"
      :elevation="12"
    >
      <v-select label="State" :items="states" v-model="selectedState" item-title="state_name" item-value="state_name"></v-select>
    
      <v-select label="From" :items="cities" v-model="searchData.source" item-title="city_name" item-value="city_name"  @blur="v$.source.$touch"
       :error-messages="v$.source.$errors.map((e)=>e.$message)"></v-select>
     
       <v-select label="To" :items="cities" v-model="searchData.destination"  @blur="v$.source.$touch"
      :error-messages="v$.source.$errors.map((e)=>e.$message)" item-title="city_name" item-value="city_name"></v-select>

<v-text-field 
v-model="searchData.totalPassengers"
color="deep-orange-darken-1"
label="Total Passengers"
@blur="v$.totalPassengers.$touch"
:error-messages="v$.totalPassengers.$errors.map((e)=>e.$message)"
></v-text-field>
 
      <div class="d-flex flex-row justify-center align-center">
        <v-btn class="bg-deep-orange-darken-1" @click="search">Search</v-btn>
      </div>
    </v-card>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {helpers, required} from "@vuelidate/validators"
import { isFirstLetterCapital, isOnlyDigits, onlyChars } from "../../public/validation";
const router = useRouter();
const store = useStore();
const selectedState = ref('Gujarat');
const states = ref([]);
const cities = ref([]);
const searchData = reactive({
  source: null,
  destination: null,
  totalPassengers:null
});

const rules = computed(()=>{
  return {
    source:{required, onlyChars:helpers.withMessage("Source should contain only characters",onlyChars), isFirstLetterCapital:helpers.withMessage("first letter should be capital",isFirstLetterCapital)},
    destination:{required, onlyChars:helpers.withMessage("Destination should contain only characters",onlyChars), isFirstLetterCapital:helpers.withMessage("first letter should be capital",isFirstLetterCapital)},
    totalPassengers:{required,isOnlyDigits:helpers.withMessage("Enter total number of passengers in digits",isOnlyDigits)}
  }
})
const v$ = useVuelidate(rules,searchData);
async function search() {
  const isValid = await v$.value.$validate();
  if(!isValid) return ;
  await store.dispatch("triggerGetSearchedBuses", searchData);
  router.push({
    name: "SearchedBuses",
    query: { source: searchData.source, dest: searchData.destination ,date:searchData.date,total:searchData.totalPassengers},
  });
}
watchEffect(async ()=>{
  cities.value = await store.dispatch("triggerGetCitiesByState",{state:selectedState.value});
})
onMounted(async()=>{
  states.value = await store.dispatch("triggerGetStatesByCountry");
})
</script>
<style scope>
.mainDiv {
  margin-top: 200px;
}
</style>
