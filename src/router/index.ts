import { useUserSessionStore } from "@/stores/UserSessionStore";
import LoginViewVue from "@/views/LoginView.vue";
import AppNavigationVue from "@/views/AppNavigation.vue";
import AppHomeVue from "@/views/AppHome.vue";
import ListReportsVue from "@/views/reports/ListReports.vue";
import { createRouter, createWebHistory } from "vue-router";
import CreateMoneyflowVue from "@/views/moneyflow/CreateMoneyflow.vue";

export enum Routes {
  Login = "login",
  Home = "home",
  ListReports = "listReports",
  CreateMoneyflow = "createMoneyflow",
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
      component: AppNavigationVue,
      children: [
        {
          path: "",
          name: Routes.Home,
          component: AppHomeVue,
        },
        {
          path: "listReports/:year?/:month?",
          name: Routes.ListReports,
          component: ListReportsVue,
          props: true,
        },
        {
          path: "createMoneyflow",
          name: Routes.CreateMoneyflow,
          component: CreateMoneyflowVue,
        },
      ],
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
