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
        if(result.status==200){
            console.log(result.data);
            return result.data;
        }else{
            return result
        }
    },

    async getTotalCancelledTickets(){
        const result = await axiosGet("/getTotalTicketsCancelledToday");
        if(result.status==200){
            console.log("total cancelled tickets ", result.data);
            return result.data;
        }else{
            return result;
        }
     
    },

    async getUsersRegisteredPerMonth(){
        const result = await axiosGet('/user/getUsersRegisteredPerMonth');
        if(result.status==200){
            return result.data;
        }else{
           return result;
        }
    },

    async getPassengersTraveledPerMonth(){
        const result = await axiosGet('/getPassengersTraveledPerMonth');
        if(result.status==200){
            return result.data;
        }else{
            return result;
        }
      
    },

    async getRecentlyRegisteredUser(){
        const result = await axiosGet('/user/getRecentlyRegisteredUser');
        if(result.status==200){
            return result.data;
        }else{
            return result;
        }
    },

    async getTotalBusesPerState(){
        const result = await axiosGet('/getTotalBusesPerState');
        if(result.status==200){
            return result.data;
        }else{
            return result;
        }
    },

    async getTotalTicketsCancelledPerMonth(){
        const result = await axiosGet('/getTotalTicketsCancelledPerMonth');
        if(result.status==200){
            return result.data;
        }else{
            return result;
        }
    },

    async getTotalCancelledTicketsWithPendingRefund(){
        const result = await axiosGet('/getTotalCancelledTicketsWithPendingRefund');
        if(result.status==200){
            return result.data;
        }else{
            return result;
        }
    }
}