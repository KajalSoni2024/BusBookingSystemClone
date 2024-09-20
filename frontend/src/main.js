import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "./routes";
import store from "./store";
loadFonts();

router.beforeEach((to, from, next) => {
  if (
    to.name == "Login" ||
    to.name == "Register" ||
    to.name == "ForgetPassword"
  ) {
    next();
  } else {
    console.log(store.state.users.token);
    if (store.state.users.token == null) {
      next({ path: "/" });
    } else {
      next();
    }
  }
});
createApp(App).use(vuetify).use(router).use(ElementPlus).use(store).mount("#app");
