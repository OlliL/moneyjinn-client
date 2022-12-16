<template>
  <CreateContractpartnerModalVue
    ref="createContractpartnerModalNav"
    id-suffix="Nav"
  />
  <CreateCapitalsourceModalVue
    ref="createCapitalsourceModalNav"
    id-suffix="Nav"
  />
  <CreatePostingAccountModalVue
    ref="createPostingAccountModalNav"
    id-suffix="Nav"
  />

  <CreatePreDefMoneyflowModalVue
    ref="createPreDedMoneyflowModalNav"
    id-suffix="Nav"
  />

  <nav class="navbar navbar-expand-lg navbar-light fixed-top bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"><small>moneyjin 0.99.0</small></a>
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
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: Routes.CreateMoneyflow }"
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
              }"
              ><i class="bi bi-card-list"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: Routes.SearchMoneyflows }"
              ><i class="bi bi-search"></i
            ></router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: Routes.ImportMoneyflows }"
              ><i class="bi bi-box-arrow-in-down-right"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><i class="bi bi-ui-checks"></i></a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-bar-chart-fill"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#">Trends</a></li>
              <li><a class="dropdown-item" href="#">Ausgabenauswertung</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              ref="dropdownPlus"
            >
              <i class="bi bi-plus-lg"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.CreateMoneyflow }"
                  >Geldbewegung hinzuf&uuml;gen</router-link
                >
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ImportReceipts }"
                  >Bons importieren</router-link
                >
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <span
                  class="dropdown-item"
                  role="button"
                  @click="showCreateCapitalsourceModal"
                  >Kapitalquellen</span
                >
              </li>
              <li>
                <span
                  class="dropdown-item"
                  role="button"
                  @click="showCreateContractpartnerModal"
                  >Vertragspartner</span
                >
              </li>
              <li>
                <span
                  class="dropdown-item"
                  role="button"
                  @click="showPreDefMoneyflowModal"
                  >vordefinierte Geldbewegungen</span
                >
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              ref="dropdownWrench"
            >
              <i class="bi bi-wrench"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListCapitalsources }"
                  >Kapitalquellen</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListContractpartners }"
                  >Vertragspartner</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListPreDefMoneyflows }"
                  >vordefinierte Geldbewegungen</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: Routes.ListMonthlySettlements }"
                  >Monatsabschl&uuml;sse</router-link
                >
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-asterisk"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#">ETF Depot</a></li>
              <li><a class="dropdown-item" href="#">neue ETF Buchung</a></li>
            </ul>
          </li>
        </ul>
        <div class="collapse navbar-collapse dropstart">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i class="bi bi-incognito"></i>
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a class="dropdown-item" href="#"
                    >pers&ouml;nliche Einstellungen</a
                  >
                </li>
                <li v-if="userIsAdmin">
                  <hr class="dropdown-divider" />
                </li>
                <li v-if="userIsAdmin">
                  <a class="dropdown-item" href="#">Systemeinstellungen</a>
                </li>
                <li v-if="userIsAdmin">
                  <a class="dropdown-item" href="#">Benutzerkonten</a>
                </li>
                <li v-if="userIsAdmin">
                  <a class="dropdown-item" href="#">Benutzergruppen</a>
                </li>
                <li v-if="userIsAdmin">
                  <a class="dropdown-item" href="#">Sprachen</a>
                </li>
                <li v-if="userIsAdmin">
                  <span
                    class="dropdown-item"
                    role="button"
                    @click="showCreatePostingAccountModal"
                    >Buchungskonten</span
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <span class="nav-link" role="button" @click="logout"
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

<script lang="ts">
import router, { Routes } from "@/router";
import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import CreateCapitalsourceModalVue from "@/components/capitalsource/CreateCapitalsourceModal.vue";
import CreatePostingAccountModalVue from "@/components/postingaccount/CreatePostingAccountModal.vue";
import CreatePreDefMoneyflowModalVue from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.vue";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import type { RouteRecordName } from "vue-router";

export default {
  name: "AppNavigation",

  data() {
    return {
      Routes: Routes,
      router: router,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      userIsAdmin: false,
    };
  },
  components: {
    CreateContractpartnerModalVue,
    CreateCapitalsourceModalVue,
    CreatePostingAccountModalVue,
    CreatePreDefMoneyflowModalVue,
  },
  mounted() {
    const userSessionStore = useUserSessionStore();
    this.userIsAdmin = userSessionStore.isAdmin;
    this.markDropdownActive(this.$route.name);
  },
  watch: {
    $route(to) {
      this.markDropdownActive(to.name);
    },
  },
  methods: {
    markDropdownActive(routeName: RouteRecordName | null | undefined) {
      const wrenchClassList = (this.$refs.dropdownWrench as HTMLElement)
        .classList;
      const plusClassList = (this.$refs.dropdownPlus as HTMLElement).classList;
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
    },
    showCreateContractpartnerModal() {
      (
        this.$refs
          .createContractpartnerModalNav as typeof CreateContractpartnerModalVue
      )._show();
    },
    showCreateCapitalsourceModal() {
      (
        this.$refs
          .createCapitalsourceModalNav as typeof CreateCapitalsourceModalVue
      )._show();
    },
    showCreatePostingAccountModal() {
      (
        this.$refs
          .createPostingAccountModalNav as typeof CreatePostingAccountModalVue
      )._show();
    },
    showPreDefMoneyflowModal() {
      (
        this.$refs
          .createPreDedMoneyflowModalNav as typeof CreatePreDefMoneyflowModalVue
      )._show();
    },
    logout() {
      const userSessionStore = useUserSessionStore();
      userSessionStore.logout();
      router.push({
        name: Routes.Login,
      });
    },
  },
};
</script>
<style scoped>
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
