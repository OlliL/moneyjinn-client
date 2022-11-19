import { useUserSessionStore } from "@/stores/UserSessionStore";
import LoginViewVue from "@/views/LoginView.vue";
import MainViewVue from "@/views/MainView.vue";
import { createRouter, createWebHistory } from "vue-router";

export enum Routes {
  Login = "login",
  Main = "main",
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: Routes.Login,
      component: LoginViewVue,
      meta: {
        hideForAuth: true,
      },
    },
    {
      path: "/",
      name: Routes.Main,
      component: MainViewVue,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.hideForAuth)) {
    const userSessionStore = useUserSessionStore();
    const userIsLoggedIn = userSessionStore.getAuthorizationToken?.length > 0;
    if (!userIsLoggedIn) {
      next({ name: Routes.Login });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
