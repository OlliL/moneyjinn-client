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

  <!-- Mobile Navigation-->
  <div class="md:hidden flex items-center justify-between p-2 border-b">
    <router-link
      class="navbar-brand bg-light"
      :to="{ name: Routes.Home, force: true }"
      ><small>moneyjin {{ version }}</small></router-link
    >

    <Sheet v-model:open="isMenuOpen">
      <SheetTrigger as-child>
        <Button variant="ghost" size="icon-sm">
          <Menu />
          <!-- Hamburger Icon -->
        </Button>
      </SheetTrigger>
      <SheetContent side="right" class="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader> </SheetHeader>
        <div class="flex flex-col gap-2">
          <!-- Hier deine Links vertikal untereinander -->
          <router-link
            @click="isMenuOpen = false"
            class="flex items-center gap-2 p-1 hover:bg-accent rounded-md !text-foreground !no-underline"
            :to="{ name: Routes.CreateMoneyflow }"
          >
            <Euro :size="20" /> {{ $t("Moneyflow.title.create") }}
          </router-link>
          <router-link
            @click="isMenuOpen = false"
            class="flex items-center gap-2 p-1 hover:bg-accent rounded-md !text-foreground !no-underline"
            :to="{
              name: Routes.ListReports,
              params: { year: year, month: month },
              force: true,
            }"
            ><Table2 :size="20" /> {{ $t("Reports.title.reports") }}
          </router-link>
          <router-link
            @click="isMenuOpen = false"
            class="flex items-center gap-2 p-1 hover:bg-accent rounded-md !text-foreground !no-underline"
            :to="{ name: Routes.SearchMoneyflows, force: true }"
            ><Search :size="20" />{{
              $t("Moneyflow.title.search")
            }}</router-link
          >
          <router-link
            @click="isMenuOpen = false"
            class="flex items-center gap-2 p-1 hover:bg-accent rounded-md !text-foreground !no-underline"
            :to="{ name: Routes.ImportMoneyflows, force: true }"
            ><SquareArrowRightEnter :size="20" />{{
              $t("Moneyflow.title.import")
            }}</router-link
          >
          <router-link
            @click="isMenuOpen = false"
            class="flex items-center gap-2 p-1 hover:bg-accent rounded-md !text-foreground !no-underline"
            :to="{ name: Routes.CompareData, force: true }"
            ><ListTodo :size="20" />{{ $t("CompareData.title") }}</router-link
          >

          <Collapsible class="w-full space-y-1">
            <CollapsibleTrigger as-child>
              <div
                class="group flex cursor-pointer items-center justify-between gap-2 p-1 hover:bg-accent rounded-md transition-all"
              >
                <div class="flex items-center gap-2">
                  <ChartColumnIncreasing :size="20" />
                  <span>{{ $t("Reports.title.charts") }}</span>
                </div>

                <ChevronDown
                  class="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent class="space-y-1 ml-6 border-l pl-2">
              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ShowTrends, force: true }"
              >
                {{ $t("Reports.title.trends") }}
              </router-link>

              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ShowReporting, force: true }"
              >
                {{ $t("Reports.title.costReporting") }}
              </router-link>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible class="w-full space-y-1">
            <CollapsibleTrigger as-child>
              <div
                class="group flex cursor-pointer items-center justify-between gap-2 p-1 hover:bg-accent rounded-md transition-all"
              >
                <div class="flex items-center gap-2">
                  <SquarePlus :size="20" />
                  <span>{{ $t("General.add") }}</span>
                </div>

                <ChevronDown
                  class="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent class="space-y-1 ml-6 border-l pl-2">
              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.CreateMoneyflow, force: true }"
              >
                {{ $t("General.moneyflow") }}
              </router-link>
              <Separator />
              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ImportReceipts, force: true }"
              >
                {{ $t("Receipt.importReceipts") }}
              </router-link>
              <Separator />
              <div
                class="cursor-pointer flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md"
                @click="showCreateCapitalsourceModal"
              >
                {{ $t("General.capitalsource") }}
              </div>
              <div
                class="cursor-pointer flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md"
                @click="showCreateContractpartnerModal"
              >
                {{ $t("General.contractpartner") }}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible class="w-full space-y-1">
            <CollapsibleTrigger as-child>
              <div
                class="group flex cursor-pointer items-center justify-between gap-2 p-1 hover:bg-accent rounded-md transition-all"
              >
                <div class="flex items-center gap-2">
                  <ChartCandlestick :size="20" />
                  <span>{{ $t("General.etfs") }}</span>
                </div>

                <ChevronDown
                  class="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent class="space-y-1 ml-6 border-l pl-2">
              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListEtfDepot, force: true }"
              >
                {{ $t("General.etfDepot") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListEtfs, force: true }"
              >
                {{ $t("General.etfs") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListEtfPreliminaryLumpSums, force: true }"
              >
                {{ $t("General.preliminaryLumpSums") }}
              </router-link>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible class="w-full space-y-1">
            <CollapsibleTrigger as-child>
              <div
                class="group flex cursor-pointer items-center justify-between gap-2 p-1 hover:bg-accent rounded-md transition-all"
              >
                <div class="flex items-center gap-2">
                  <SquareUserRound :size="20" />
                  <span>{{ $t("General.profile") }}</span>
                </div>

                <ChevronDown
                  class="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
                />
              </div>
            </CollapsibleTrigger>

            <Separator />
            <CollapsibleContent class="space-y-1 ml-6 border-l pl-2">
              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ChangePassword, force: true }"
              >
                {{ $t("User.title.changePassword") }}
              </router-link>
              <router-link
                v-if="userIsAdmin"
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListPostingAccounts, force: true }"
              >
                {{ $t("General.postingAccounts") }}
              </router-link>
              <router-link
                v-if="userIsAdmin"
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListUsers, force: true }"
              >
                {{ $t("General.users") }}
              </router-link>
              <router-link
                v-if="userIsAdmin"
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListGroups, force: true }"
              >
                {{ $t("General.groups") }}
              </router-link>
            </CollapsibleContent>
          </Collapsible>

          <div
            class="flex items-center gap-2 p-1 cursor-pointer"
            @click="logout"
          >
            <LogOut :size="20" @click="logout" />
            {{ $t("General.logout") }}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
  <!-- Desktop Navigation-->
  <Menubar
    class="hidden md:flex py-0 px-4 h-12 w-full sticky top-0 z-50 rounded-none border-b top-0 z-50 bg-background rounded-none border-b"
  >
    <MenubarMenu>
      <MenubarTrigger>
        <router-link
          class="navbar-brand bg-light"
          :to="{ name: Routes.Home, force: true }"
          ><small>moneyjin {{ version }}</small></router-link
        ></MenubarTrigger
      >
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger
        ><router-link
          class="!text-foreground !no-underline"
          :to="{ name: Routes.CreateMoneyflow, force: true }"
          :title="$t('Moneyflow.title.create')"
          ><Euro class="m-2"
        /></router-link>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <router-link
          class="!text-foreground !no-underline"
          :to="{
            name: Routes.ListReports,
            params: { year: year, month: month },
            force: true,
          }"
          :title="$t('Reports.title.reports')"
          ><Table2 class="m-2"
        /></router-link>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <router-link
          class="!text-foreground !no-underline"
          :to="{ name: Routes.SearchMoneyflows, force: true }"
          :title="$t('Moneyflow.title.search')"
          ><Search class="m-2"
        /></router-link>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <router-link
          class="!text-foreground !no-underline"
          :to="{ name: Routes.ImportMoneyflows, force: true }"
          :title="$t('Moneyflow.title.import')"
          ><SquareArrowRightEnter class="m-2"
        /></router-link>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <router-link
          class="!text-foreground !no-underline"
          :to="{ name: Routes.CompareData, force: true }"
          :title="$t('CompareData.title')"
          ><ListTodo class="m-2"
        /></router-link>
      </MenubarTrigger>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger
        ><span ref="dropdownChart" class="flex flex-row items-center"
          ><ChartColumnIncreasing class="ml-2 text-foreground" />
          <ChevronDown :size="10" class="ml-1 opacity-70" /></span
      ></MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ShowTrends, force: true }"
            >{{ $t("Reports.title.trends") }}</router-link
          >
        </MenubarItem>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ShowReporting, force: true }"
            >{{ $t("Reports.title.costReporting") }}</router-link
          >
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger
        ><span ref="dropdownPlus" class="flex flex-row items-center"
          ><SquarePlus class="ml-2 text-foreground" /><ChevronDown
            :size="10"
            class="ml-1 opacity-70" /></span
      ></MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.CreateMoneyflow, force: true }"
            >{{ $t("General.moneyflow") }}</router-link
          >
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ImportReceipts, force: true }"
            >{{ $t("Receipt.importReceipts") }}</router-link
          >
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <span class="cursor-pointer" @click="showCreateCapitalsourceModal">{{
            $t("General.capitalsource")
          }}</span>
        </MenubarItem>
        <MenubarItem>
          <span
            class="cursor-pointer"
            @click="showCreateContractpartnerModal"
            >{{ $t("General.contractpartner") }}</span
          >
        </MenubarItem>
        <MenubarItem>
          <span class="cursor-pointer" @click="showPreDefMoneyflowModal">{{
            $t("General.preDefMoneyflow")
          }}</span>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger
        ><span ref="dropdownWrench" class="flex flex-row items-center"
          ><Wrench class="ml-2 text-foreground" /><ChevronDown
            :size="10"
            class="ml-1 opacity-70" /></span
      ></MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ListCapitalsources, force: true }"
            >{{ $t("General.capitalsources") }}</router-link
          >
        </MenubarItem>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ListContractpartners, force: true }"
            >{{ $t("General.contractpartners") }}</router-link
          >
        </MenubarItem>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{
              name: Routes.ListContractpartnerMatchings,
              force: true,
            }"
            >{{ $t("General.contractpartnerMatchings") }}</router-link
          >
        </MenubarItem>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ListPreDefMoneyflows, force: true }"
            >{{ $t("General.preDefMoneyflows") }}</router-link
          >
        </MenubarItem>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ListMonthlySettlements, force: true }"
            >{{ $t("General.monthlysettlements") }}</router-link
          >
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger
        ><span ref="dropdownEtf" class="flex flex-row items-center"
          ><ChartCandlestick class="ml-2 text-foreground" /><ChevronDown
            :size="10"
            class="ml-1 opacity-70" /></span
      ></MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ListEtfDepot, force: true }"
            >{{ $t("General.etfDepot") }}</router-link
          >
        </MenubarItem>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ListEtfs, force: true }"
            >{{ $t("General.etfs") }}</router-link
          >
        </MenubarItem>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ListEtfPreliminaryLumpSums, force: true }"
            >{{ $t("General.preliminaryLumpSums") }}</router-link
          >
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <div class="flex-grow"></div>

    <MenubarMenu>
      <MenubarTrigger
        ><span ref="dropdownUser" class="flex flex-row items-center"
          ><SquareUserRound class="ml-2 text-foreground" /><ChevronDown
            :size="10"
            class="ml-1 opacity-70" /></span
      ></MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ChangePassword, force: true }"
            >{{ $t("User.title.changePassword") }}</router-link
          >
        </MenubarItem>
        <MenubarSeparator v-if="userIsAdmin" />
        <MenubarItem v-if="userIsAdmin">
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ListPostingAccounts, force: true }"
            >{{ $t("General.postingAccounts") }}</router-link
          >
        </MenubarItem>
        <MenubarSeparator v-if="userIsAdmin" />
        <MenubarItem v-if="userIsAdmin">
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ListUsers, force: true }"
            >{{ $t("General.users") }}</router-link
          >
        </MenubarItem>
        <MenubarItem v-if="userIsAdmin">
          <router-link
            class="!text-foreground !no-underline"
            :to="{ name: Routes.ListGroups, force: true }"
            >{{ $t("General.groups") }}</router-link
          >
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger :title="$t('General.logout')"
        ><span><LogOut class="m-2 text-foreground" @click="logout" /></span
      ></MenubarTrigger>
    </MenubarMenu>
  </Menubar>
  <div class="mt-10">
    <router-view v-slot="{ Component }">
      <keep-alive include="SearchMoneyflows">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { onMounted, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, type RouteRecordName } from "vue-router";

import router, { Routes } from "@/router";
import { version } from "../../package.json";

import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import CreateCapitalsourceModalVue from "@/components/capitalsource/CreateCapitalsourceModal.vue";
import CreatePreDefMoneyflowModalVue from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useUserSessionStore } from "@/stores/UserSessionStore";
import { StoreService } from "@/stores/StoreService";

import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import { clearAuthTokens } from "axios-jwt";
import { LogoutApi } from "@/api";
import { AxiosSingleton } from "@/config/AxiosSingleton";

import {
  Menu,
  Euro,
  Table2,
  Search,
  SquareArrowRightEnter,
  ListTodo,
  ChartColumnIncreasing,
  SquarePlus,
  Wrench,
  ChartCandlestick,
  SquareUserRound,
  LogOut,
  ChevronDown,
} from "lucide-vue-next";

const { t } = useI18n();

const isMenuOpen = ref(false);
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const userIsAdmin = ref(false);
const route = useRoute();

const dropdownWrench = useTemplateRef<HTMLLinkElement>("dropdownWrench");
const dropdownPlus = useTemplateRef<HTMLLinkElement>("dropdownPlus");
const dropdownChart = useTemplateRef<HTMLLinkElement>("dropdownChart");
const dropdownEtf = useTemplateRef<HTMLLinkElement>("dropdownEtf");
const dropdownUser = useTemplateRef<HTMLLinkElement>("dropdownUser");
const createContractpartnerModalNav = useTemplateRef<
  typeof CreateContractpartnerModalVue
>("createContractpartnerModalNav");
const createCapitalsourceModalNav = useTemplateRef<
  typeof CreateCapitalsourceModalVue
>("createCapitalsourceModalNav");
const createPreDedMoneyflowModalNav = useTemplateRef<
  typeof CreatePreDefMoneyflowModalVue
>("createPreDedMoneyflowModalNav");

const markDropdownActive = (routeName: RouteRecordName | null | undefined) => {
  if (
    dropdownWrench.value &&
    dropdownPlus.value &&
    dropdownChart.value &&
    dropdownEtf.value &&
    dropdownUser.value
  ) {
    const wrenchClassList = dropdownWrench.value.classList;
    const plusClassList = dropdownPlus.value.classList;
    const chartClassList = dropdownChart.value.classList;
    const etfClassList = dropdownEtf.value.classList;
    const userClassList = dropdownUser.value.classList;
    const routerLinkActive = "router-link-active";

    wrenchClassList.remove(routerLinkActive);
    plusClassList.remove(routerLinkActive);
    chartClassList.remove(routerLinkActive);
    etfClassList.remove(routerLinkActive);
    userClassList.remove(routerLinkActive);
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
      case Routes.ShowTrends:
      case Routes.ShowReporting: {
        chartClassList.add(routerLinkActive);
        break;
      }
      case Routes.ListEtfs:
      case Routes.ListEtfDepot:
      case Routes.ListEtfPreliminaryLumpSums: {
        etfClassList.add(routerLinkActive);
        break;
      }
      case Routes.ChangePassword:
      case Routes.ListPostingAccounts:
      case Routes.ListUsers:
      case Routes.ListGroups: {
        userClassList.add(routerLinkActive);
        break;
      }
    }
  }
};

const showCreateContractpartnerModal = () => {
  createContractpartnerModalNav.value?._show();
};

const showCreateCapitalsourceModal = () => {
  createCapitalsourceModalNav.value?._show();
};
const showPreDefMoneyflowModal = () => {
  createPreDedMoneyflowModalNav.value?._show();
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
/* Wenn a aktiv ist, färbe alle Svg-Icons im Inneren blau */
:deep(.router-link-active svg) {
  stroke: blue !important; /* Ein schönes Bootstrap-Blau */
  stroke-width: 2.5px !important;
}
</style>
