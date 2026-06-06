import { useUserSessionStore } from "@/stores/UserSessionStore";
import { isLoggedIn } from "axios-jwt";
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from "vue-router";
import { toast } from "vue-sonner";

export enum Routes {
  Login = "login",
  Home = "home",
  ListReports = "listReports",
  CreateMoneyflow = "createMoneyflow",
  ListCapitalsources = "listCapitalsources",
  ListContractpartners = "listContractpartners",
  ListContractpartnerMatchings = "ListContractpartnerMatchings",
  ListEtfDepot = "listEtfDepot",
  ListEtfs = "listEtfs",
  ListEtfPreliminaryLumpSums = "listEtfPreliminaryLumpSums",
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
export enum DropdownMenus {
  Chart = "chart",
  Plus = "plus",
  Wrench = "wrench",
  Etf = "etf",
  Profile = "profile",
}
const router = createRouter({
  history: createWebHistory((import.meta as any).env?.BASE_URL),
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
      component: () => import("@/views/navigation/AppNavigation.vue"),
      children: [
        {
          path: "",
          name: Routes.Home,
          component: () => import("@/views/AppHome.vue"),
        },
        {
          path: "listReports/:year?/:month?/:sortBy?/:sortDirection?",
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
          meta: { activeMenu: DropdownMenus.Plus },
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
          meta: { activeMenu: DropdownMenus.Wrench },
        },
        {
          path: "listPostingAccounts",
          name: Routes.ListPostingAccounts,
          component: () =>
            import("@/views/postingaccount/ListPostingAccounts.vue"),
          meta: { activeMenu: DropdownMenus.Profile },
        },
        {
          path: "listContractpartners",
          name: Routes.ListContractpartners,
          component: () =>
            import("@/views/contractpartner/ListContractpartners.vue"),
          meta: { activeMenu: DropdownMenus.Wrench },
        },
        {
          path: "listContractpartnerMatchings",
          name: Routes.ListContractpartnerMatchings,
          component: () =>
            import("@/views/contractpartnermatching/ListContractpartnerMatchings.vue"),
          meta: { activeMenu: DropdownMenus.Wrench },
        },
        {
          path: "listGroups",
          name: Routes.ListGroups,
          component: () => import("@/views/group/ListGroups.vue"),
          meta: { activeMenu: DropdownMenus.Profile },
        },
        {
          path: "listUsers",
          name: Routes.ListUsers,
          component: () => import("@/views/user/ListUsers.vue"),
          meta: { activeMenu: DropdownMenus.Profile },
        },
        {
          path: "listPreDefMoneyflows",
          name: Routes.ListPreDefMoneyflows,
          component: () =>
            import("@/views/predefmoneyflow/ListPreDefMoneyflows.vue"),
          meta: { activeMenu: DropdownMenus.Wrench },
        },
        {
          path: "listMonthlySettlements/:year?/:month?",
          name: Routes.ListMonthlySettlements,
          component: () =>
            import("@/views/monthlysettlement/ListMonthlySettlements.vue"),
          props: true,
          meta: { activeMenu: DropdownMenus.Wrench },
        },
        {
          path: "listEtfDepot/:etfId?",
          name: Routes.ListEtfDepot,
          component: () => import("@/views/etf/ListEtfDepot.vue"),
          props: true,
          meta: { activeMenu: DropdownMenus.Etf },
        },
        {
          path: "listEtfs",
          name: Routes.ListEtfs,
          component: () => import("@/views/etf/ListEtfs.vue"),
          meta: { activeMenu: DropdownMenus.Etf },
        },
        {
          path: "listEtfPreliminaryLumpSums/:etfId?/:year?",
          name: Routes.ListEtfPreliminaryLumpSums,
          component: () => import("@/views/etf/ListPreliminaryLumpSums.vue"),
          props: true,
          meta: { activeMenu: DropdownMenus.Etf },
        },
        {
          path: "showTrends",
          name: Routes.ShowTrends,
          component: () => import("@/views/reports/ShowTrends.vue"),
          meta: { activeMenu: DropdownMenus.Chart },
        },
        {
          path: "showReporting",
          name: Routes.ShowReporting,
          component: () => import("@/views/reports/ShowReporting.vue"),
          meta: { activeMenu: DropdownMenus.Chart },
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
          meta: { activeMenu: DropdownMenus.Profile },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/navigation/AppNavigation.vue"),
    },
  ],
});

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    toast.dismiss();

    const loginNeeded = !to.matched.some((record) => record.meta.hideForAuth);

    const loggedIn = await isLoggedIn();
    if (!loggedIn && loginNeeded) {
      return { name: Routes.Login };
    }

    if (to.name === Routes.ChangePassword || to.name === Routes.Login) {
      return true;
    }

    const userSessionStore = useUserSessionStore();
    if (userSessionStore.userSession.userIsNew) {
      return { name: Routes.ChangePassword };
    }

    if (
      to.name !== undefined &&
      to.fullPath !== undefined &&
      to.fullPath === from.fullPath
    ) {
      router.go(0);
      return false;
    }
    return true;
  },
);

export default router;
