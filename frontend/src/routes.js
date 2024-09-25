import { createWebHistory, createRouter } from "vue-router";
const routes = [
  {
    name: "Login",
    component: () => import("./components/GeneralComponents/login.vue"),
    path: "/",
  },
  {
    name: "Register",
    component: () => import("./components/GeneralComponents/register.vue"),
    path: "/register",
  },
  {
    name: "MyBookings",
    component: () => import("./components/UserSideComponents/BookedBuses.vue"),
    path: "/myBooking",
    meta: { requiredAuth: true },
  },
  {
    name: "HomePage",
    component: () => import("./components/UserSideComponents/homePage.vue"),
    path: "/home",
    meta: { requiredAuth: true },
  },
  {
    name: "AllBuses",
    component: () => import("./components/UserSideComponents/AllBuses.vue"),
    path: "/buses",
    meta: { requiredAuth: true },
  },
  {
    name: "SearchedBuses",
    component: () => import("./components/UserSideComponents/searchedBuses.vue"),
    path: "/searchedBuses",
    meta: { requiredAuth: true },
  },
  {
    name: "BookTicket",
    component: () => import("./components/UserSideComponents/bookTicket.vue"),
    path: "/bookTicket",
    meta: { requiredAuth: true },
  },
  {
    name: "PaymentFail",
    component: () => import("./components/UserSideComponents/paymentFail.vue"),
    path: "/paymentFail",
    meta: { requiredAuth: true },
  },
  {
    name :"AddBusDetail",
    component:()=>import("./components/adminSideComponents/addBusDetail.vue"),
    path:"/addBusDetail",
    meta:{requiredAuth:true},
  },
  {
    name:"AddConductorDetail",
   component:()=>import("./components/adminSideComponents/AddConductorDetails.vue"),
    path:"/addConductorDetails"
  },{
    name:"TicketDetails",
    component:()=>import("./components/UserSideComponents/ticketDetails.vue"),
    path:"/ticketDetails"
  },
  {
    name:"EditableBusDetails",
    component:()=>import("./components/adminSideComponents/EditableBusDetails.vue"),
    path:'/adminAllBuses'
  },
  {
    name:"EditBusDetailForm",
    component:()=>import("./components/adminSideComponents/EditBusDetailForm.vue"),
    path:'/editBusDetail'
  },
  {
    name:"ForgetPassword",
    component:()=>import("./components/GeneralComponents/forgetPass.vue"),
    path:'/forgetPass'
  },
  {
    name:"UsersDetails",
    component:()=>import("./components/adminSideComponents/UsersDetails.vue"),
    path:'/userDetails'
  },
  {
    name:"ListOfTickets",
    component:()=>import("./components/UserSideComponents/ListOfTickets.vue"),
    path:'/listOfTickets'
  },
  {
    name:"ListOfPassengers",
    component:()=>import("./components/ConductorSideComponents/ListOfPassenger.vue"),
    path:'/listOfPassengers'
  },
  {
    name:"AssignedBuses",
    component:()=>import("./components/ConductorSideComponents/BusesAssignedToConductor.vue"),
    path:"/assignedBuses"
  },
  {
    name:"SendEmail",
    component:()=>import("./components/sendEmail.vue"),
    path:"/sendEmail"
  },
  {
    name:"ListOfTicketsCanceled",
    component:()=>import("./components/adminSideComponents/listOfTicketsCanceled.vue"),
    path:"/listOfCanceledTickets"
  },
  {
    name:"TicketCancelSuccess",
    component:()=>import("./components/adminSideComponents/TicketCancelationSuccess.vue"),
    path:"/ticketCancelationSuccess"
  },
  {
    name:"TicketCanceledByBusId",
    component:()=>import("./components/ConductorSideComponents/ListOfTicketsCanceledByBusId.vue"),
    path:"/listOfCanceledTicketsByBusId"
  },
  {
    name:"AskYourQuery",
    component:()=>import("./components/UserSideComponents/AskQuery.vue"),
    path:"/askYourQuery"
  },
  {
    name:"ListOfUsersHavingQuery",
    component:()=>import("./components/adminSideComponents/ListOfUsersAskingQuery.vue"),
    path:"/listOfUsersHavingQuery"
  },
  {
    name:"AdminChat",
    component:()=>import("./components/adminSideComponents/AdminChat.vue"),
    path:"/usersQuery"
  },
  {
    name:"DashBoard",
    component:()=>import("./components/adminSideComponents/Dashboard.vue"),
    path:"/dashboard"
  },{
    name:"ErrorPage",
    component:()=>import("./components/GeneralComponents/ErrorPage.vue"),
    path:"/errorPage"
  },{
    name:"UserProfile",
    component:()=>import("./components/UserSideComponents/UserProfile.vue"),
    path:"/userProfile"
  },
 {
  name:"AdminProfile",
  component:()=>import("./components/adminSideComponents/AdminProfile.vue"),
  path:"/adminProfile"
 },
  {
    name:"ConductorProfile",
    component:()=>import("./components/ConductorSideComponents/ConductorProfile"),
    path:"/conductorProfile"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
