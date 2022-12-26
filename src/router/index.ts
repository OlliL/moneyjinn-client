import { createRouter, createWebHistory } from "vue-router";
import { useUserSessionStore } from "@/stores/UserSessionStore";

export enum Routes {
  Login = "login",
  Home = "home",
  ListReports = "listReports",
  CreateMoneyflow = "createMoneyflow",
  ListCapitalsources = "listCapitalsources",
  ListContractpartners = "listContractpartners",
  ListEtfDepot = "listEtfDepot",
  ListGroups = "listGroups",
  ListMonthlySettlements = "listMonthlySettlements",
  ListPostingAccounts = "listPostingAccounts",
  ListPreDefMoneyflows = "listPreDefMoneyflows",
  ListUsers = "listUsers",
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
      component: () => import("@/views/LoginView.vue"),
      meta: {
        hideForAuth: true,
      },
    },
    {
      path: "/app",
      component: () => import("@/views/AppNavigation.vue"),
      children: [
        {
          path: "",
          name: Routes.Home,
          component: () => import("@/views/AppHome.vue"),
        },
        {
          path: "listReports/:year?/:month?",
          name: Routes.ListReports,
          component: () => import("@/views/reports/ListReports.vue"),
          props: true,
        },
        {
          path: "createMoneyflow",
          name: Routes.CreateMoneyflow,
          component: () => import("@/views/moneyflow/CreateMoneyflow.vue"),
        },
        {
          path: "importMoneyflows",
          name: Routes.ImportMoneyflows,
          component: () => import("@/views/moneyflow/ImportMoneyflows.vue"),
        },
        {
          path: "importReceipts",
          name: Routes.ImportReceipts,
          component: () => import("@/views/moneyflow/SearchMoneyflows.vue"),
        },
        {
          path: "searchMoneyflows",
          name: Routes.SearchMoneyflows,
          component: () => import("@/views/moneyflow/SearchMoneyflows.vue"),
          meta: { keepAlive: true },
        },
        {
          path: "listCapitalsources/:letter?",
          name: Routes.ListCapitalsources,
          component: () =>
            import("@/views/capitalsource/ListCapitalsources.vue"),
          props: true,
        },
        {
          path: "listPostingAccounts/:letter?",
          name: Routes.ListPostingAccounts,
          component: () =>
            import("@/views/postingaccount/ListPostingAccounts.vue"),
          props: true,
        },
        {
          path: "listContractpartners/:letter?",
          name: Routes.ListContractpartners,
          component: () =>
            import("@/views/contractpartner/ListContractpartners.vue"),
          props: true,
        },
        {
          path: "listGroups/:letter?",
          name: Routes.ListGroups,
          component: () => import("@/views/group/ListGroups.vue"),
          props: true,
        },
        {
          path: "listUsers/:letter?",
          name: Routes.ListUsers,
          component: () => import("@/views/user/ListUsers.vue"),
          props: true,
        },
        {
          path: "listPreDefMoneyflows/:letter?",
          name: Routes.ListPreDefMoneyflows,
          component: () =>
            import("@/views/predefmoneyflow/ListPreDefMoneyflows.vue"),
          props: true,
        },
        {
          path: "listMonthlySettlements/:year?/:month?",
          name: Routes.ListMonthlySettlements,
          component: () =>
            import("@/views/monthlysettlement/ListMonthlySettlements.vue"),
          props: true,
        },
        {
          path: "listEtfDepot",
          name: Routes.ListEtfDepot,
          component: () => import("@/views/etf/ListEtfDepot.vue"),
        },
        {
          path: "showTrends",
          name: Routes.ShowTrends,
          component: () => import("@/views/reports/ShowTrends.vue"),
        },
        {
          path: "showReporting",
          name: Routes.ShowReporting,
          component: () => import("@/views/reports/ShowReporting.vue"),
        },
        {
          path: "compareData",
          name: Routes.CompareData,
          component: () => import("@/views/comparedata/CompareData.vue"),
        },
        {
          path: "changePassword",
          name: Routes.ChangePassword,
          component: () => import("@/views/user/ChangePassword.vue"),
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
