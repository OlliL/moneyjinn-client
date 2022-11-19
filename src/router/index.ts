import LoginViewVue from "@/views/LoginView.vue";
import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginViewVue,
    },
  ],
});

export default router;
