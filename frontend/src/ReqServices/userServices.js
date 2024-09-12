import {axiosPost, axiosGet} from '../services/service';

export default {
async registerUser(payload){
 return await axiosPost('/user/register',payload);
 },
 async resetPassword(payload){
    return await axiosPost("/user/resetPassword",payload)
 },
 async loginUser(payload){
   return await  axiosPost("/auth/login", payload);
 },
 async getAllUser(){
   return await axiosGet("/user/getAllUsers");
 },
 async getListOfConductors(){
  return await axiosGet('/user/getListOfConductors');
 },
 async getListOfDrivers(){
  return await axiosGet('/user/getListOfDrivers');
 },
 async getUserById(id){
   return await axiosGet(`/user/getUserById/?userId=${id}`)
 }
}