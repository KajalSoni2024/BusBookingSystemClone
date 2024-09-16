import {axiosPost,axiosGet} from '../services/service';

export default {
    async bookTicket(payload){
        return await axiosPost("/tickets/createTicket",payload);
    },

    async addPassengers(payload){
        return await axiosPost("/addPassengers",payload);
    },

    async makePayment(payload){
        return await axiosPost("/makePayment",payload);
    },
   
    async getTicketDetailById(payload){
        return await axiosGet(`/getTicketDetailsById/?ticketId=${payload.ticketId}`);
    },

    async getTicketsByUserId(payload){
        return await  axiosGet(`/tickets/getTicketsByUserId/?userId=${payload.userId}`);
    },

    async getBookedTickets(){
    return await axiosGet('/tickets/getBookedTickets');
    },

    async getBookedTicketDetailById(payload){
        return await axiosGet(`/tickets/getBookedTicketDetails/?ticketId=${payload.ticketId}`);
    },

    async getPassengersList(payload){
        return await axiosGet(`/tickets/getPassengersList/?busId=${payload.busId}&date=${payload.date}`);
    },
    async updatePassengersTraveledStatus(payload){
        const result = await axiosGet(`/updatePassengersTraveledStatus/?passengerId=${payload.passengerId}&hasTraveled=${payload.hasTraveled}`);
        return result;
    },
   async generateOtpToCancelTicket(payload){
       return await axiosPost('/tickets/generateOtpToCancelTicket',payload)
   },
   async cancelBookedTicket(payload){
    console.log(payload);
     return await axiosPost('/tickets/cancelBookedTicket',payload);
   }
}