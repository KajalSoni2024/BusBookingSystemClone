import { createWebHistory, createRouter } from "vue-router";
const routes = [
  {
    name: "Login",
    component: () => import("./components/login.vue"),
    path: "/",
  },
  {
    name: "Register",
    component: () => import("./components/register.vue"),
    path: "/register",
  },
  {
    name: "MyBookings",
    component: () => import("./components/BookedBuses.vue"),
    path: "/myBooking",
    meta: { requiredAuth: true },
  },
  {
    name: "HomePage",
    component: () => import("./components/homePage.vue"),
    path: "/home",
    meta: { requiredAuth: true },
  },
  {
    name: "AllBuses",
    component: () => import("./components/AllBuses.vue"),
    path: "/buses",
    meta: { requiredAuth: true },
  },
  {
    name: "SearchedBuses",
    component: () => import("./components/searchedBuses.vue"),
    path: "/searchedBuses",
    meta: { requiredAuth: true },
  },
  {
    name: "BookTicket",
    component: () => import("./components/bookTicket.vue"),
    path: "/bookTicket",
    meta: { requiredAuth: true },
  },
  {
    name: "PaymentSuccess",
    component: () => import("./components/paymentSuccess.vue"),
    path: "/showTicket",
    meta: { requiredAuth: true },
  },
  {
    name: "PaymentFail",
    component: () => import("./components/paymentFail.vue"),
    path: "/paymentFail",
    meta: { requiredAuth: true },
  },
  {
    name :"AddBusDetail",
    component:()=>import("./components/addBusDetail.vue"),
    path:"/addBusDetail",
    meta:{requiredAuth:true},
  },
  {
    name:"AddConductorDetail",
   component:()=>import("./components/AddConductorDetails.vue"),
    path:"/addConductorDetails"
  },{
    name:"TicketDetails",
    component:()=>import("./components/ticketDetails.vue"),
    path:"/ticketDetails"
  },
  {
    name:"EditableBusDetails",
    component:()=>import("./components/EditableBusDetails.vue"),
    path:'/adminAllBuses'
  },
  {
    name:"EditBusDetailForm",
    component:()=>import("./components/EditBusDetailForm.vue"),
    path:'/editBusDetail'
  },
  {
    name:"ForgetPassword",
    component:()=>import("./components/forgetPass.vue"),
    path:'/forgetPass'
  },
  {
    name:"UsersDetails",
    component:()=>import("./components/UsersDetails.vue"),
    path:'/userDetails'
  },
  {
    name:"ListOfTickets",
    component:()=>import("./components/ListOfTickets.vue"),
    path:'/listOfTickets'
  },
  {
    name:"ListOfPassengers",
    component:()=>import("./components/ListOfPassenger.vue"),
    path:'/listOfPassengers'
  },
  {
    name:"AssignedBuses",
    component:()=>import("./components/BusesAssignedToConductor.vue"),
    path:"/assignedBuses"
  },
  {
    name:"SendEmail",
    component:()=>import("./components/sendEmail.vue"),
    path:"/sendEmail"
  },
  {
    name:"ListOfTicketsCanceled",
    component:()=>import("./components/listOfTicketsCanceled.vue"),
    path:"/listOfCanceledTickets"
  },
  {
    name:"TicketCancelSuccess",
    component:()=>import("./components/TicketCancelationSuccess.vue"),
    path:"/ticketCancelationSuccess"
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
