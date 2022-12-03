import { createRouter, createWebHistory } from "vue-router";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import AppHomeVue from "@/views/AppHome.vue";
import AppNavigationVue from "@/views/AppNavigation.vue";
import LoginViewVue from "@/views/LoginView.vue";
import ListReportsVue from "@/views/reports/ListReports.vue";
import CreateMoneyflowVue from "@/views/moneyflow/CreateMoneyflow.vue";
import ListCapitalsourcesVue from "@/views/capitalsource/ListCapitalsources.vue";
import ListContractpartnersVue from "@/views/contractpartner/ListContractpartners.vue";

export enum Routes {
  Login = "login",
  Home = "home",
  ListReports = "listReports",
  CreateMoneyflow = "createMoneyflow",
  ListCapitalsources = "listCapitalsources",
  ListContractpartners = "listContractpartners",
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
        {
          path: "listCapitalsources/:letter?",
          name: Routes.ListCapitalsources,
          component: ListCapitalsourcesVue,
          props: true,
        },
        {
          path: "listContractpartners/:letter?",
          name: Routes.ListContractpartners,
          component: ListContractpartnersVue,
          props: true,
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
