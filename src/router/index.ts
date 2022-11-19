import { useUserSessionStore } from "@/stores/UserSessionStore";
import LoginViewVue from "@/views/LoginView.vue";
import AppNavigation from "@/views/AppNavigation.vue";
import { createRouter, createWebHistory } from "vue-router";

export enum Routes {
  Login = "login",
  App = "app",
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
      path: "/app",
      name: Routes.App,
      component: AppNavigation,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userSessionStore = useUserSessionStore();
  const userIsLoggedIn = userSessionStore.getAuthorizationToken?.length > 0;
  const loginNeeded = !to.matched.some((record) => record.meta.hideForAuth);

  if (userIsLoggedIn || !loginNeeded) {
    next();
  } else {
    next({ name: Routes.Login });
  }
});

export default router;
