
import {axiosPost} from "../services/service";

export default {
    async addRouteDetail(payload){
        return await axiosPost("/addBusRoute",payload)
    },
    async updateRouteDetail(payload){
        return await axiosPost("/updateBusRouteDetails",payload)
    }
}