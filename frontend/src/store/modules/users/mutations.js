export const mutations = {
  SET_AUTH(state, payload) {
    state.isLoggedIn = true;
    state.role = payload.role;
    state.token = payload.token;
  },
  RESET_AUTH(state) {
    state.isLoggedIn = false;
    state.role = null;
    state.token = null;
  },
  GET_SEARCHED_BUSES(state, payload) {
    state.searchedBuses = payload.data;
  },
  GET_ALL_BUSES(state, payload){
    state.allBuses = payload.data;
  },
  GET_BUSES_WITHOUT_CONDUCTORS(state, payload){
    state.busesWithoutConductors = payload.data;
  },
  GET_BUS_SEATS_BY_BUS_ID(state, payload){
    state.busSeatsByBusId= payload.data;
  }
  ,
  GET_TICKET_DETAILS(state,payload){
    state.ticketDetails=payload.data;
  },
  GET_BOOKED_TICKETS(state,payload){
    state.bookedTickets=payload.data;
  },
  GET_BUS_DETAILS_BY_ID(state,payload){
    state.busDetailsById=payload.data;
  },
  GET_ASSIGNED_BUSES(state,payload){
    console.log("mutation ",payload);
    state.assignedBuses=payload.data;
  },
  GET_PASSENGERS_LIST(state,payload){
    state.passengersList=payload.data;
  },
  GET_USER_MESSAGES(state,payload){
    state.messages=payload.data;
  }
};
