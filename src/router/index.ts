import { createRouter, createWebHistory } from "vue-router";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import AppHomeVue from "@/views/AppHome.vue";
import AppNavigationVue from "@/views/AppNavigation.vue";
import LoginViewVue from "@/views/LoginView.vue";
import ListReportsVue from "@/views/reports/ListReports.vue";
import CreateMoneyflowVue from "@/views/moneyflow/CreateMoneyflow.vue";
import ListCapitalsourcesVue from "@/views/capitalsource/ListCapitalsources.vue";
import ListPostingAccountsVue from "@/views/postingaccount/ListPostingAccounts.vue";
import ListContractpartnersVue from "@/views/contractpartner/ListContractpartners.vue";
import ImportMoneyflowsVue from "@/views/moneyflow/ImportMoneyflows.vue";
import ListMonthlySettlementsVue from "@/views/monthlysettlement/ListMonthlySettlements.vue";
import SearchMoneyflowsVue from "@/views/moneyflow/SearchMoneyflows.vue";
import ListPreDefMoneyflowsVue from "@/views/predefmoneyflow/ListPreDefMoneyflows.vue";
import ListEtfDepotVue from "@/views/etf/ListEtfDepot.vue";
import ImportReceiptsVue from "@/views/receipt/ImportReceipts.vue";
import ShowTrendsVue from "@/views/reports/ShowTrends.vue";
import ShowReportingVue from "@/views/reports/ShowReporting.vue";
import CompareDataVue from "@/views/comparedata/CompareData.vue";
import ChangePasswordVue from "@/views/user/ChangePassword.vue";

export enum Routes {
  Login = "login",
  Home = "home",
  ListReports = "listReports",
  CreateMoneyflow = "createMoneyflow",
  ListCapitalsources = "listCapitalsources",
  ListPostingAccounts = "listPostingAccounts",
  ListContractpartners = "listContractpartners",
  ListMonthlySettlements = "listMonthlySettlements",
  ListPreDefMoneyflows = "listPreDefMoneyflows",
  ListEtfDepot = "listEtfDepot",
  ImportMoneyflows = "importMoneyflows",
  ImportReceipts = "importReceipts",
  SearchMoneyflows = "searchMoneyflows",
  ShowTrends = "showTrends",
  ShowReporting = "showReporting",
  CompareData = "compareData",
  ChangePassword = "changePassword",
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
          path: "importReceipts",
          name: Routes.ImportReceipts,
          component: ImportReceiptsVue,
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
          path: "listPostingAccounts/:letter?",
          name: Routes.ListPostingAccounts,
          component: ListPostingAccountsVue,
          props: true,
        },
        {
          path: "listContractpartners/:letter?",
          name: Routes.ListContractpartners,
          component: ListContractpartnersVue,
          props: true,
        },
        {
          path: "listPreDefMoneyflows/:letter?",
          name: Routes.ListPreDefMoneyflows,
          component: ListPreDefMoneyflowsVue,
          props: true,
        },
        {
          path: "listMonthlySettlements/:year?/:month?",
          name: Routes.ListMonthlySettlements,
          component: ListMonthlySettlementsVue,
          props: true,
        },
        {
          path: "listEtfDepot",
          name: Routes.ListEtfDepot,
          component: ListEtfDepotVue,
        },
        {
          path: "showTrends",
          name: Routes.ShowTrends,
          component: ShowTrendsVue,
        },
        {
          path: "showReporting",
          name: Routes.ShowReporting,
          component: ShowReportingVue,
        },
        {
          path: "compareData",
          name: Routes.CompareData,
          component: CompareDataVue,
        },
        {
          path: "changePassword",
          name: Routes.ChangePassword,
          component: ChangePasswordVue,
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
