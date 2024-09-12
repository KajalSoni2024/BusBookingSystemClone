import { createStore } from "vuex";
import { admin } from "./modules/admin";
import { users } from "./modules/users";
const store = createStore({
  modules: {
    admin,
    users,
  },
});

export default store;
