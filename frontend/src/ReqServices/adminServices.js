import {axiosGet} from "../services/service";

export default {
    async getTotalUsers(){
   const result = await axiosGet('/user/getTotalUsers');
   console.log(result.data);
   return result.data;
    },

    async getTotalBuses(){
    const result = await axiosGet('/getTotalBuses');
    console.log(result.data);
    return result.data;
    },

    async getTotalTicketsBooked(){
        const result = await axiosGet('/getTotalPassengersTraveledToday');
        console.log(result.data);
        return result.data;
    },

    async getTotalCancelledTickets(){
        const result = await axiosGet("/getTotalTicketsCancelledToday");
        console.log(result.data);
        return result.data;
    },

    async getUsersRegisteredPerMonth(){
        const result = await axiosGet('/user/getUsersRegisteredPerMonth');
        return result.data;
    },

    async getPassengersTraveledPerMonth(){
        const result = await axiosGet('/getPassengersTraveledPerMonth');
        return result.data;
    },

    async getRecentlyRegisteredUser(){
        const result = await axiosGet('/user/getRecentlyRegisteredUser');
        return result.data;
    }
}