import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import SolidButton from "@/components/InputsAndControls/SolidButton.vue";
import LinkButton from "@/components/InputsAndControls/LinkButton.vue";
import AppIcon from "@/components/Visuals/AppIcon.vue";
import AppHeader from "@/components/Navigation/AppHeader.vue";
import { auth } from "./firebaseConfig";
import { useUserStore } from "./stores/userStore";
import { createUserIfNotExists } from "./firebaseService.js";

let isAppMounted = false;

auth.onAuthStateChanged(async (user) => {
  const app = createApp(App);
  const pinia = createPinia();

  app.component("SolidButton", SolidButton);
  app.component("AppIcon", AppIcon);
  app.component("AppHeader", AppHeader);
  app.component("LinkButton", LinkButton);

  app.use(pinia);

  const userStore = useUserStore();

  if (user) {
    userStore.setUser(user);
    await createUserIfNotExists(user);
  } else {
    userStore.logout();
  }

  // use router after Firebase auth is ready
  app.use(router);

  if (!isAppMounted) {
    app.mount("#app");
    isAppMounted = true;
  }
});
