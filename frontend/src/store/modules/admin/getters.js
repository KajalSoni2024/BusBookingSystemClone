export const getters = {
    getListOfCanceledTickets(state){
     return state.listOfCanceledTickets.filter((ticket)=>{return (ticket.refundDetail===null)?true:false})
    }
};
