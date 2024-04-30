import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from "vue-router";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { isLoggedIn } from "axios-jwt";

export enum Routes {
  Login = "login",
  Home = "home",
  ListReports = "listReports",
  CreateMoneyflow = "createMoneyflow",
  ListCapitalsources = "listCapitalsources",
  ListContractpartners = "listContractpartners",
  ListEtfDepot = "listEtfDepot",
  ListEtfs = "listEtfs",
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
      path: "/login/:error?",
      name: Routes.Login,
      component: () => import("@/views/LoginView.vue"),
      meta: {
        hideForAuth: true,
      },
      props: true,
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
          component: () => import("@/views/receipt/ImportReceipts.vue"),
        },
        {
          path: "searchMoneyflows",
          name: Routes.SearchMoneyflows,
          component: () => import("@/views/moneyflow/SearchMoneyflows.vue"),
          meta: { keepAlive: true },
        },
        {
          path: "listCapitalsources",
          name: Routes.ListCapitalsources,
          component: () =>
            import("@/views/capitalsource/ListCapitalsources.vue"),
        },
        {
          path: "listPostingAccounts",
          name: Routes.ListPostingAccounts,
          component: () =>
            import("@/views/postingaccount/ListPostingAccounts.vue"),
        },
        {
          path: "listContractpartners",
          name: Routes.ListContractpartners,
          component: () =>
            import("@/views/contractpartner/ListContractpartners.vue"),
        },
        {
          path: "listGroups",
          name: Routes.ListGroups,
          component: () => import("@/views/group/ListGroups.vue"),
        },
        {
          path: "listUsers",
          name: Routes.ListUsers,
          component: () => import("@/views/user/ListUsers.vue"),
        },
        {
          path: "listPreDefMoneyflows",
          name: Routes.ListPreDefMoneyflows,
          component: () =>
            import("@/views/predefmoneyflow/ListPreDefMoneyflows.vue"),
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
          path: "listEtfs",
          name: Routes.ListEtfs,
          component: () => import("@/views/etf/ListEtfs.vue"),
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
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/AppNavigation.vue"),
    },
  ],
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const loginNeeded = !to.matched.some((record) => record.meta.hideForAuth);

    isLoggedIn().then((loggedIn: boolean) => {
      if (!loggedIn && loginNeeded) {
        next({ name: Routes.Login });
        return;
      }

      if (to.name === Routes.ChangePassword || to.name === Routes.Login) {
        next();
        return;
      }

      const userSessionStore = useUserSessionStore();
      if (userSessionStore.userIsNew) {
        next({ name: Routes.ChangePassword });
        return;
      }

      if (
        to.name !== undefined &&
        to.fullPath !== undefined &&
        to.fullPath === from.fullPath
      ) {
        router.go(0);
        return;
      }
      next();
    });
  },
);

export default router;
