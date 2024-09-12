import {axiosPost} from '../services/service';
export default {
    async addConductorDetails(payload){
    return await axiosPost('/addConductorDetails',payload)
    },
    async updateConductorDetail(payload){
        return await axiosPost('/updateBusConductorDetails',payload)
    }
}