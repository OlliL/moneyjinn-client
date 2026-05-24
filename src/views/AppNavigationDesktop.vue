<template>
  <!-- Desktop Navigation-->
  <Menubar
    class="hidden md:flex py-0 px-4 h-12 w-full sticky top-0 z-50 rounded-none border-b top-0 z-50 bg-background rounded-none border-b"
    :key="route.name"
  >
    <MenubarMenu>
      <MenubarTrigger as-child>
        <router-link
          class="text-foreground no-underline"
          :to="{ name: Routes.Home, force: true }"
          ><small>moneyjin {{ version }}</small></router-link
        ></MenubarTrigger
      >
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger as-child
        ><router-link
          class="text-foreground no-underline transition-colors hover:text-primary"
          exact-active-class="bg-muted text-primary font-medium"
          :to="{ name: Routes.CreateMoneyflow, force: true }"
          :title="$t('Moneyflow.title.create')"
          ><Euro class="m-2 text-muted-foreground"
        /></router-link>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger as-child>
        <router-link
          class="text-foreground no-underline transition-colors hover:text-primary"
          exact-active-class="bg-muted text-primary font-medium"
          :to="{
            name: Routes.ListReports,
            params: { year: year, month: month },
            force: true,
          }"
          :title="$t('General.moneyflows')"
          ><Table2 class="m-2 text-muted-foreground"
        /></router-link>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger as-child>
        <router-link
          class="text-foreground no-underline transition-colors hover:text-primary"
          exact-active-class="bg-muted text-primary font-medium"
          :to="{ name: Routes.SearchMoneyflows, force: true }"
          :title="$t('Moneyflow.title.search')"
          ><Search class="m-2 text-muted-foreground"
        /></router-link>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger as-child>
        <router-link
          class="text-foreground no-underline transition-colors hover:text-primary"
          exact-active-class="bg-muted text-primary font-medium"
          :to="{ name: Routes.ImportMoneyflows, force: true }"
          :title="$t('Moneyflow.title.import')"
          ><SquareArrowRightEnter class="m-2 text-muted-foreground"
        /></router-link>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger as-child>
        <router-link
          class="text-foreground no-underline transition-colors hover:text-primary"
          exact-active-class="bg-muted text-primary font-medium"
          :to="{ name: Routes.CompareData, force: true }"
          :title="$t('CompareData.title')"
          ><ListTodo class="m-2 text-muted-foreground"
        /></router-link>
      </MenubarTrigger>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger as-child
        ><span
          :class="[
            'flex flex-row items-center',
            isMenuActve(DropdownMenus.Chart),
          ]"
          ><ChartColumnIncreasing class="m-1 text-muted-foreground" />
          <ChevronDown :size="10" class="ml-1 opacity-70" /></span
      ></MenubarTrigger>
      <MenubarContent>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ShowTrends, force: true }"
            >{{ $t("Reports.title.trends") }}</router-link
          >
        </MenubarItem>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ShowReporting, force: true }"
            >{{ $t("Reports.title.costReporting") }}</router-link
          >
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger as-child
        ><span
          :class="[
            'flex flex-row items-center',
            isMenuActve(DropdownMenus.Plus),
          ]"
          ><SquarePlus class="m-1 text-muted-foreground" /><ChevronDown
            :size="10"
            class="ml-1 opacity-70" /></span
      ></MenubarTrigger>
      <MenubarContent>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.CreateMoneyflow, force: true }"
            >{{ $t("General.moneyflow") }}</router-link
          >
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ImportReceipts, force: true }"
            >{{ $t("Receipt.importReceipts") }}</router-link
          >
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem as-child>
          <span
            class="cursor-pointer"
            @click="emit('showCreateCapitalsourceModal')"
            >{{ $t("General.capitalsource") }}</span
          >
        </MenubarItem>
        <MenubarItem as-child>
          <span
            class="cursor-pointer"
            @click="emit('showCreateContractpartnerModal')"
            >{{ $t("General.contractpartner") }}</span
          >
        </MenubarItem>
        <MenubarItem as-child>
          <span
            class="cursor-pointer"
            @click="emit('showPreDefMoneyflowModal')"
            >{{ $t("General.preDefMoneyflow") }}</span
          >
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger as-child
        ><span
          :class="[
            'flex flex-row items-center',
            isMenuActve(DropdownMenus.Wrench),
          ]"
          ><Wrench class="m-1 text-muted-foreground" /><ChevronDown
            :size="10"
            class="ml-1 opacity-70" /></span
      ></MenubarTrigger>
      <MenubarContent>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListCapitalsources, force: true }"
            >{{ $t("General.capitalsources") }}</router-link
          >
        </MenubarItem>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListContractpartners, force: true }"
            >{{ $t("General.contractpartners") }}</router-link
          >
        </MenubarItem>
        <MenubarItem as-child>
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{
              name: Routes.ListContractpartnerMatchings,
              force: true,
            }"
            >{{ $t("General.contractpartnerMatchings") }}</router-link
          >
        </MenubarItem>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListPreDefMoneyflows, force: true }"
            >{{ $t("General.preDefMoneyflows") }}</router-link
          >
        </MenubarItem>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListMonthlySettlements, force: true }"
            >{{ $t("General.monthlysettlements") }}</router-link
          >
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger as-child
        ><span
          :class="[
            'flex flex-row items-center',
            isMenuActve(DropdownMenus.Etf),
          ]"
          ><ChartCandlestick class="m-1 text-muted-foreground" /><ChevronDown
            :size="10"
            class="ml-1 opacity-70" /></span
      ></MenubarTrigger>
      <MenubarContent>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListEtfDepot, force: true }"
            >{{ $t("General.etfDepot") }}</router-link
          >
        </MenubarItem>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListEtfs, force: true }"
            >{{ $t("General.etfs") }}</router-link
          >
        </MenubarItem>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListEtfPreliminaryLumpSums, force: true }"
            >{{ $t("General.preliminaryLumpSums") }}</router-link
          >
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <div class="flex-grow"></div>

    <MenubarMenu>
      <MenubarTrigger as-child
        ><span
          :class="[
            'flex flex-row items-center',
            isMenuActve(DropdownMenus.Profile),
          ]"
          ><SquareUserRound class="m-1 text-muted-foreground" /><ChevronDown
            :size="10"
            class="ml-1 opacity-70" /></span
      ></MenubarTrigger>
      <MenubarContent>
        <MenubarItem as-child class="cursor-pointer">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ChangePassword, force: true }"
            >{{ $t("User.title.changePassword") }}</router-link
          >
        </MenubarItem>
        <MenubarSeparator v-if="isAdmin" />
        <MenubarItem as-child class="cursor-pointer" v-if="isAdmin">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListPostingAccounts, force: true }"
            >{{ $t("General.postingAccounts") }}</router-link
          >
        </MenubarItem>
        <MenubarSeparator v-if="isAdmin" />
        <MenubarItem as-child class="cursor-pointer" v-if="isAdmin">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListUsers, force: true }"
            >{{ $t("General.users") }}</router-link
          >
        </MenubarItem>
        <MenubarItem as-child class="cursor-pointer" v-if="isAdmin">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListGroups, force: true }"
            >{{ $t("General.groups") }}</router-link
          >
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger
        as-child
        class="cursor-pointer"
        :title="$t('General.logout')"
        @click="emit('logout')"
        ><span><LogOut class="m-2 text-muted-foreground" /></span
      ></MenubarTrigger>
    </MenubarMenu>
  </Menubar>
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
import { DropdownMenus, Routes } from "@/router";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  ChartCandlestick,
  ChartColumnIncreasing,
  ChevronDown,
  Euro,
  ListTodo,
  LogOut,
  Search,
  SquareArrowRightEnter,
  SquarePlus,
  SquareUserRound,
  Table2,
  Wrench,
} from "lucide-vue-next";
import { useRoute } from "vue-router";
import { version } from "../../package.json";

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;

const { isAdmin } = useUserSessionStore();
const route = useRoute();

const emit = defineEmits([
  "logout",
  "showCreateContractpartnerModal",
  "showCreateCapitalsourceModal",
  "showPreDefMoneyflowModal",
]);

const isMenuActve = (menu: DropdownMenus) => {
  return route.meta?.activeMenu === menu ? "router-link-active" : "";
};
</script>

<style scoped>
@reference "@/style.css";

:deep(.router-link-active svg) {
  @apply !stroke-primary;
  stroke-width: 2.5px !important;
}
</style>
