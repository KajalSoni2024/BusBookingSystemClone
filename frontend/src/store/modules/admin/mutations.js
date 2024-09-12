export const mutations = {
    GET_ALL_USERS(state,payload){
     state.allUsers=payload.data;
    },
    GET_TICKET_DETAILS_BY_ID(state,payload){
     state.ticketDetailsById=payload.data
    },
    GET_TICKETS_BY_USER_ID(state,payload){
        state.ticketsByUserId = payload.data;
    }
};
