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
 },
async sendEmail(payload){
  return await axiosPost('/emailer/sendEmail',payload);
},
async getOtpForForgetPassRequest(payload){
  return await axiosGet(`/user/getOtpForForgetPassRequest/?email=${payload.email}`);
},

async checkForgetPassOtp(payload){
  console.log(payload);
  return await axiosGet(`/user/checkForgetPassOtp/?userId=${payload.userId}&opt=${payload.otp}`)
},
 async sendMessage(payload){
  return await axiosPost('/messages/sendMessage',payload);
 },

 async getMessages(payload){
  const result = await axiosGet(`/messages/getMessages/?receiverId=${payload.receiverId}`);
  return result;
 },

 async getAllMessagesByChannel(){
  return await axiosGet('/messages/getAllMessagesByChannel')
 }
}