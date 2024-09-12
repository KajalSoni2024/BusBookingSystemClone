import userService from "../../../ReqServices/userServices.js";
import ticketDetailServices from "@/ReqServices/ticketDetailServices.js";
import busDetailServices from "@/ReqServices/busDetailServices.js";
import { AUTH_TOKEN } from "@/Contants/thirdPartyApi.js";
export const actions = {
  async triggerSetAuth({ commit }, payload) {
    const result = await userService.loginUser(payload);
    if (result.status == 200) {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("role", result.data.role);
      commit("SET_AUTH", result.data);
    }
  },

  async triggerResetAuth({ commit }) {
    console.log("calling reset method");
    commit("RESET_AUTH");
  },

  async triggerGetSearchedBuses({ commit }, payload) {
    const result = await busDetailServices.getBusByRoute(payload);
    commit("GET_SEARCHED_BUSES", { data: result.data });
  },

  async triggerGetAllBuses({commit}){
   const result  = await busDetailServices.getAllBuses()
   commit("GET_ALL_BUSES",{data:result.data})
  },
  async triggerGetBusesWithoutConductors({commit}){
  const result = await busDetailServices.getBusesWithoutConductor()
  commit("GET_BUSES_WITHOUT_CONDUCTORS",{data:result.data});
  }
,
  async triggerGetBusSeatsByBusId({commit},payload){
   const result = await busDetailServices.getBusSeatsById(payload)
   commit("GET_BUS_SEATS_BY_BUS_ID",{data:result.data});
  },
  async triggerGetTicketDetails({commit},payload){
    const result = await ticketDetailServices.getBookedTicketDetailById(payload);
    console.log(result.data)
    commit("GET_TICKET_DETAILS",{data:result.data})
  },
  async triggerGetBookedTickets({commit}){
  const result = await ticketDetailServices.getBookedTickets();
  commit("GET_BOOKED_TICKETS",{data:result.data});
  },
 async triggerGetBusDetailsById({commit},payload){
  const result = await busDetailServices.getBusDetailById(payload)
  commit("GET_BUS_DETAILS_BY_ID",{data:result.data});
 },
 async triggerRegisterUser({commit},payload){
  console.log(commit);
  return await userService.registerUser(payload);
 },
async triggerResetPassword({commit},payload){
  console.log(commit);
  return await userService.resetPassword(payload);
},
async triggerGetStatesByCountry({commit}){
console.log(commit);
const response = await fetch(`https://www.universal-tutorial.com/api/states/India`,{headers:{
  method:'GET',
  Authorization:`Bearer ${AUTH_TOKEN}`,
  Accept:'application/json',
}}
);
const result = await response.json();
return result;
},
async triggerGetCitiesByState({commit},payload){
  console.log(commit);
  const response = await fetch(`https://www.universal-tutorial.com/api/cities/${payload.state}`,{headers:{
    method:'GET',
    Authorization:`Bearer ${AUTH_TOKEN}`,
    Accept:'application/json',
  }}
  );
  const result = await response.json();
  return result;
},

async triggerGetListOfConductors({commit}){
  console.log(commit);
  const result =  await userService.getListOfConductors();
  return result.data;
},

async triggerGetListOfDrivers({commit}){
  console.log(commit);
 const result = await userService.getListOfDrivers();
 return result.data;
},

async triggerGetUserById({commit},payload){
  console.log(commit);
  const result = await userService.getUserById(payload.userId);
  return result.data;
},

async triggerGetAssignedBuses({commit}){
  console.log(commit);
  const result = await busDetailServices.getAssignedBuses();
  commit("GET_ASSIGNED_BUSES",{data:result.data});
},
async triggerGetPassengersList({commit},payload){
  console.log(commit);
  const result = await ticketDetailServices.getPassengersList(payload);
  commit("GET_PASSENGERS_LIST",{data:result.data});
},

async triggerUpdatePassengersTraveledStatus({commit},payload){
  console.log(commit);
  const result = await ticketDetailServices.updatePassengersTraveledStatus(payload);
  return result;
}
};
