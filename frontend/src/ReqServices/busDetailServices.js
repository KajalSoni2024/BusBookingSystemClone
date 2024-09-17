import {axiosPost,axiosGet} from "../services/service";

export default {
    async addBusDetail(payload){
        const result =  await axiosPost('/addBusDetails',payload)
        console.log("SDFSDFSDFGSDGSDG",result.data);
        return result;
    },

    async updateBusDetail(payload){
        return await axiosPost('/updateBusDetails',payload)
    },
    async getBusByRoute(payload){
        return await axiosGet(`/getBusByRoute/?source=${payload.source}&dest=${payload.destination}`);
    },
    async getAllBuses(){
        return await axiosGet("/getAllBuses");
    },
    async getBusesWithoutConductor(){
        return await axiosGet("/getBusesWithoutConductors");
    },
    async getBusSeatsById(payload){
        return await axiosGet(`/getBusSeatsById/?busId=${payload.busId}`);
    },
    async getBusDetailById(payload){
        return await axiosGet(`/getBusDetailsById/?busId:${payload.busId}`);
    },
    async getAssignedBuses(){
        const result =  await axiosGet(`/getAssignedBuses`);
        console.log(result.data)
        return result;
    },
    async getBusDetailByBusName(payload){
        const result = await axiosGet(`/getBusDetailByBusName/?busName=${payload.busName}&busNo=${payload.busNo}`)
        console.log(result.data);
        return result;
    }
  
}