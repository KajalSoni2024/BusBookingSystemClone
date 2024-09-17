export const mutations = {
    GET_ALL_USERS(state,payload){
     state.allUsers=payload.data;
    },
    GET_TICKET_DETAILS_BY_ID(state,payload){
     state.ticketDetailsById=payload.data
    },
    GET_TICKETS_BY_USER_ID(state,payload){
        state.ticketsByUserId = payload.data;
    },
    GET_ALL_CANCELED_TICKETS(state,payload){
      const result = payload.data.filter((ticket)=>{return (ticket.refundDetail===null)?true:false})
      state.listOfCanceledTickets=result;
    },
    GET_LIST_OF_CANCELED_TICKETS_BY_BUS_ID(state,payload){
      state.listOfCanceledTicketsByBusId=payload.data;
    }
};
