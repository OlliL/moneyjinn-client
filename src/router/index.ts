import { createRouter, createWebHistory } from "vue-router";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import AppHomeVue from "@/views/AppHome.vue";
import AppNavigationVue from "@/views/AppNavigation.vue";
import LoginViewVue from "@/views/LoginView.vue";
import ListReportsVue from "@/views/reports/ListReports.vue";
import CreateMoneyflowVue from "@/views/moneyflow/CreateMoneyflow.vue";
import ListCapitalsourcesVue from "@/views/capitalsource/ListCapitalsources.vue";
import ListContractpartnersVue from "@/views/contractpartner/ListContractpartners.vue";
import ImportMoneyflowsVue from "@/views/moneyflow/ImportMoneyflows.vue";
import ListMonthlySettlementsVue from "@/views/monthlysettlement/ListMonthlySettlements.vue";
import SearchMoneyflowsVue from "@/views/moneyflow/SearchMoneyflows.vue";

export enum Routes {
  Login = "login",
  Home = "home",
  ListReports = "listReports",
  CreateMoneyflow = "createMoneyflow",
  ListCapitalsources = "listCapitalsources",
  ListContractpartners = "listContractpartners",
  ListMonthlySettlements = "listMonthlySettlements",
  ImportMoneyflows = "importMoneyflows",
  SearchMoneyflows = "searchMoneyflows",
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
          path: "importMoneyflows",
          name: Routes.ImportMoneyflows,
          component: ImportMoneyflowsVue,
        },
        {
          path: "searchMoneyflows",
          name: Routes.SearchMoneyflows,
          component: SearchMoneyflowsVue,
          meta: { keepAlive: true },
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
        {
          path: "listMonthlySettlements/:year?/:month?",
          name: Routes.ListMonthlySettlements,
          component: ListMonthlySettlementsVue,
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
