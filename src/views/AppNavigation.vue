<template>
  <CreateContractpartnerModalVue
    ref="createContractpartnerModalNav"
    id-suffix="Nav"
  />
  <CreateCapitalsourceModalVue
    ref="createCapitalsourceModalNav"
    id-suffix="Nav"
  />
  <CreatePreDefMoneyflowModalVue
    ref="createPreDedMoneyflowModalNav"
    id-suffix="Nav"
  />

  <nav class="navbar navbar-expand-lg navbar-light fixed-top bg-light">
    <div class="container-fluid">
      <router-link
        class="navbar-brand bg-light"
        :to="{ name: Routes.Home, force: true }"
        ><small>moneyjin {{ version }}</small></router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse"
        id="navbarSupportedContent"
        ref="navbarSupportedContent"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: Routes.CreateMoneyflow, force: true }"
              @click="collapseNavbar"
              ><i class="bi bi-currency-euro"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <router-link
              :class="
                $route.matched.some(({ name }) => name === Routes.ListReports)
                  ? 'router-link-active nav-link'
                  : 'nav-link'
              "
              :to="{
                name: Routes.ListReports,
                params: { year: year, month: month },
                force: true,
              }"
              @click="collapseNavbar"
              ><i class="bi bi-card-list"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: Routes.SearchMoneyflows, force: true }"
              @click="collapseNavbar"
              ><i class="bi bi-search"></i
            ></router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: Routes.ImportMoneyflows, force: true }"
              @click="collapseNavbar"
              ><i class="bi bi-box-arrow-in-down-right"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: Routes.CompareData, force: true }"
              @click="collapseNavbar"
              ><i class="bi bi-ui-checks"></i
            ></router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-bar-chart-fill"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ShowTrends, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("Reports.title.trends") }}</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ShowReporting, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("Reports.title.costReporting") }}</router-link
                >
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              data-bs-toggle="dropdown"
              ref="dropdownPlus"
            >
              <i class="bi bi-plus-lg"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.CreateMoneyflow, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("General.moneyflow") }}</router-link
                >
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ImportReceipts, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("Receipt.importReceipts") }}</router-link
                >
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <span
                  class="dropdown-item"
                  @click="showCreateCapitalsourceModal"
                  >{{ $t("General.capitalsource") }}</span
                >
              </li>
              <li>
                <span
                  class="dropdown-item"
                  @click="showCreateContractpartnerModal"
                  >{{ $t("General.contractpartner") }}</span
                >
              </li>
              <li>
                <span class="dropdown-item" @click="showPreDefMoneyflowModal">{{
                  $t("General.preDefMoneyflow")
                }}</span>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              data-bs-toggle="dropdown"
              ref="dropdownWrench"
            >
              <i class="bi bi-wrench"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListCapitalsources, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("General.capitalsources") }}</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListContractpartners, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("General.contractpartners") }}</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListPreDefMoneyflows, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("General.preDefMoneyflows") }}</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListMonthlySettlements, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("General.monthlysettlements") }}</router-link
                >
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              data-bs-toggle="dropdown"
              ref="dropdownGraphUpArrow"
            >
              <i class="bi bi-graph-up-arrow"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListEtfDepot, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("General.etfDepot") }}</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListEtfs, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("General.etfs") }}</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListEtfPreliminaryLumpSums, force: true }"
                  @click="collapseNavbar"
                  >{{ $t("General.preliminaryLumpSums") }}</router-link
                >
              </li>
            </ul>
          </li>
        </ul>
        <div v-if="serverErrors">
          <div
            class="alert alert-danger text-center"
            v-for="(error, index) in serverErrors"
            :key="index"
          >
            {{ error }}
          </div>
        </div>
        <div class="navbar dropstart">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                <i class="bi bi-incognito"></i>
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <router-link
                    class="dropdown-item"
                    :to="{ name: Routes.ChangePassword, force: true }"
                    @click="collapseNavbar"
                    >{{ $t("User.title.changePassword") }}</router-link
                  >
                </li>
                <li v-if="userIsAdmin">
                  <hr class="dropdown-divider" />
                </li>
                <li v-if="userIsAdmin">
                  <router-link
                    class="dropdown-item"
                    :to="{ name: Routes.ListPostingAccounts, force: true }"
                    @click="collapseNavbar"
                    >{{ $t("General.postingAccounts") }}</router-link
                  >
                </li>
                <li v-if="userIsAdmin">
                  <hr class="dropdown-divider" />
                </li>
                <li v-if="userIsAdmin">
                  <router-link
                    class="dropdown-item"
                    :to="{ name: Routes.ListUsers, force: true }"
                    @click="collapseNavbar"
                    >{{ $t("General.users") }}</router-link
                  >
                </li>
                <li v-if="userIsAdmin">
                  <router-link
                    class="dropdown-item"
                    :to="{ name: Routes.ListGroups, force: true }"
                    @click="collapseNavbar"
                    >{{ $t("General.groups") }}</router-link
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <span class="nav-link" @click="logout"
                ><i class="bi bi-box-arrow-right"></i
              ></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <main>
    <div style="margin-top: 80px">
      <router-view v-slot="{ Component }">
        <keep-alive include="SearchMoneyflows">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, type RouteRecordName } from "vue-router";

import router, { Routes } from "@/router";
import { version } from "../../package.json";

import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import CreateCapitalsourceModalVue from "@/components/capitalsource/CreateCapitalsourceModal.vue";
import CreatePreDefMoneyflowModalVue from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.vue";

import { useUserSessionStore } from "@/stores/UserSessionStore";
import { StoreService } from "@/stores/StoreService";

import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import { clearAuthTokens } from "axios-jwt";
import { LogoutApi } from "@/api";
import { AxiosSingleton } from "@/config/AxiosSingleton";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const userIsAdmin = ref(false);
const route = useRoute();

const dropdownWrench = ref();
const dropdownPlus = ref();
const createContractpartnerModalNav = ref();
const createCapitalsourceModalNav = ref();
const createPreDedMoneyflowModalNav = ref();
const navbarSupportedContent = ref();

const markDropdownActive = (routeName: RouteRecordName | null | undefined) => {
  const wrenchClassList = dropdownWrench.value.classList;
  const plusClassList = dropdownPlus.value.classList;
  const routerLinkActive = "router-link-active";

  wrenchClassList.remove(routerLinkActive);
  plusClassList.remove(routerLinkActive);
  switch (routeName) {
    case Routes.ListPreDefMoneyflows:
    case Routes.ListCapitalsources:
    case Routes.ListContractpartners:
    case Routes.ListMonthlySettlements: {
      wrenchClassList.add(routerLinkActive);
      break;
    }
    case Routes.ImportReceipts: {
      plusClassList.add(routerLinkActive);
      break;
    }
  }
};

const collapseNavbar = () => {
  (navbarSupportedContent.value as HTMLDivElement).classList.add("collapsed");
  (navbarSupportedContent.value as HTMLDivElement).classList.remove("show");
};

const showCreateContractpartnerModal = () => {
  createContractpartnerModalNav.value._show();
};

const showCreateCapitalsourceModal = () => {
  createCapitalsourceModalNav.value._show();
};
const showPreDefMoneyflowModal = () => {
  createPreDedMoneyflowModalNav.value._show();
};
const logout = async () => {
  WebSocketSingleton.getInstance().disconnectStompClient();
  const userSessionStore = useUserSessionStore();
  userSessionStore.logout();

  await new LogoutApi(
    undefined,
    "",
    AxiosSingleton.getInstance().getAxiosInstance(),
  )
    .logout()
    .then(async () => {
      await clearAuthTokens();
    })
    .catch(async () => {
      await clearAuthTokens();
    });

  router.push({
    name: Routes.Login,
  });
};

onMounted(() => {
  const userSessionStore = useUserSessionStore();
  userIsAdmin.value = userSessionStore.isAdmin;
  markDropdownActive(route.name);

  // make WebSocket connection
  WebSocketSingleton.getInstance().connectStompClient();
  // initialize Stores
  StoreService.getInstance()
    .initAllStores()
    .catch(() => {
      router.push({
        name: Routes.Login,
        params: { error: t("Errors.noMasterData") },
      });
    });
});

watch(
  () => route.name,
  (newVal) => {
    markDropdownActive(newVal);
  },
);
</script>
<style scoped>
.alert {
  margin-bottom: 0px !important;
  margin-left: 20px !important;
}

.router-link-active {
  background-color: lightgrey;
}

.nav-item {
  padding-left: 15px;
}

small {
  font-size: 0.7rem;
  vertical-align: middle;
}

.navbar .navbar-nav .nav-link {
  font-size: 1.1em;
}

.navbar .navbar-nav .nav-link:hover {
  background-color: silver;
}

a.show {
  background-color: silver;
}
</style>
