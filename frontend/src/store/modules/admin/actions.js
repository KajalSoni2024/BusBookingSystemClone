import busDetailServices from "@/ReqServices/busDetailServices";
import routeDetailServices from "@/ReqServices/routeDetailServices";
import conductorDetailServices from "@/ReqServices/conductorDetailServices";
import ticketDetailServices from "@/ReqServices/ticketDetailServices";
import userServices from "@/ReqServices/userServices";
export const actions = {
   async triggerGetAllUsers({commit}){
        try{
            const result = await userServices.getAllUser();
            commit('GET_ALL_USERS',{data:result.data});
        }catch(err){
            console.log(err)
        }
    },

    async triggerGetTicketDetailsById({commit},payload){
        try{
        const result = await ticketDetailServices.getTicketDetailById(payload);
        commit('GET_TICKET_DETAILS_BY_ID',{data:result.data});
        }catch(err){
            console.log(err)
        }
    },
    async triggerGetTicketsByUserId({commit},payload){
        try{
        const result = await ticketDetailServices.getTicketsByUserId(payload);
        commit('GET_TICKETS_BY_USER_ID',{data:result.data});
        }catch(err){
            console.log(err);
        }
    },

    async triggerAddBusDetail({commit},payload){
        console.log(commit);
        console.log(payload);
        try{
       return await busDetailServices.addBusDetail(payload)
        }catch(err){
            console.log(err)
        }
    },

    async triggerAddBusRoute({commit},payload){
        console.log(commit);
        try{
        return await routeDetailServices.addRouteDetail(payload);
        }catch(err){
            console.log(err)
        }
    },

    async triggerAddConductorDetail({commit},payload){
        console.log(commit);
        try{
        return await conductorDetailServices.addConductorDetails(payload)
        }catch(err){
            console.log(err)
        }
    },
    async triggerBookTicket({commit},payload){
        console.log(commit);
         return await ticketDetailServices.bookTicket(payload);
       },

    async triggerAddPassenger({commit},payload){
        console.log(commit);
        return await ticketDetailServices.addPassengers(payload);
       },

    async triggerMakePayment({commit},payload){
        console.log(commit);
        return await ticketDetailServices.makePayment(payload);
       },
    
    async triggerUpdateBusDetail({commit},payload){
        console.log(commit);
        return await busDetailServices.updateBusDetail(payload);
    },

    async triggerUpdateConductorDetail({commit},payload){
        console.log(commit);
        return await conductorDetailServices.updateConductorDetail(payload);
    },

    async triggerUpdateRouteDetail({commit},payload){
        console.log(commit);
        return await routeDetailServices.updateRouteDetail(payload);
    },

    async triggerGetAllTicketsCanceled({commit}){
        console.log(commit);
        const result = await ticketDetailServices.getAllTicketsCanceled();
        commit("GET_ALL_CANCELED_TICKETS",{data:result.data});
    },

    async triggerPayRefund({commit},payload){
        console.log(commit);
        return await ticketDetailServices.payRefund(payload);
    },

    async triggerSetRefundStatusSuccess({commit},payload){
        console.log(commit);
        return await ticketDetailServices.setRefundStatusSuccess(payload)
    },

    async triggerGetListOfCanceledTicketsByBusId({commit},payload){
    const result = await ticketDetailServices.getListOfCanceledTicketsByBusId(payload);
    commit("GET_LIST_OF_CANCELED_TICKETS_BY_BUS_ID",{data:result.data});
    },

    async triggerGetBusDetailByName({commit},payload){
        console.log(commit);
    return await busDetailServices.getBusDetailByBusName(payload);
    }


};
