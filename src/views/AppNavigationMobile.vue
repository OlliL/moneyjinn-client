<template>
  <!-- Mobile Navigation-->
  <div
    class="md:hidden flex items-center justify-between p-2 border-b sticky top-0 z-50 bg-background"
  >
    <router-link
      class="text-foreground no-underline"
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
        <SheetHeader>
          <SheetTitle class="hidden" />
          <SheetDescription class="hidden" />
        </SheetHeader>
        <div class="flex flex-col gap-2">
          <!-- Place your links here, vertically stacked -->
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
            ><Table2 :size="20" /> {{ $t("General.moneyflows") }}
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
                <div
                  :class="[
                    'flex items-center gap-2',
                    isMenuActve(DropdownMenus.Chart),
                  ]"
                >
                  <ChartColumnIncreasing :size="20" />
                  <span>{{ $t("Reports.title.charts") }}</span>
                </div>

                <ChevronDown
                  class="icon-small transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent class="space-y-1 ml-6 border-l pl-2">
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ShowTrends, force: true }"
              >
                {{ $t("Reports.title.trends") }}
              </router-link>

              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
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
                <div
                  :class="[
                    'flex items-center gap-2',
                    isMenuActve(DropdownMenus.Plus),
                  ]"
                >
                  <SquarePlus :size="20" />
                  <span>{{ $t("General.add") }}</span>
                </div>

                <ChevronDown
                  class="icon-small transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent class="space-y-1 ml-6 border-l pl-2">
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.CreateMoneyflow, force: true }"
              >
                {{ $t("General.moneyflow") }}
              </router-link>
              <Separator />
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ImportReceipts, force: true }"
              >
                {{ $t("Receipt.importReceipts") }}
              </router-link>
              <Separator />
              <div
                class="cursor-pointer flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md"
                @click="emit('showCreateCapitalsourceModal')"
              >
                {{ $t("General.capitalsource") }}
              </div>
              <div
                class="cursor-pointer flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md"
                @click="emit('showCreateContractpartnerModal')"
              >
                {{ $t("General.contractpartner") }}
              </div>
              <div
                class="cursor-pointer flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md"
                @click="emit('showPreDefMoneyflowModal')"
              >
                {{ $t("General.preDefMoneyflow") }}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible class="w-full space-y-1">
            <CollapsibleTrigger as-child>
              <div
                class="group flex cursor-pointer items-center justify-between gap-2 p-1 hover:bg-accent rounded-md transition-all"
              >
                <div
                  :class="[
                    'flex items-center gap-2',
                    isMenuActve(DropdownMenus.Wrench),
                  ]"
                >
                  <Wrench :size="20" />
                  <span>{{ $t("General.edit") }}</span>
                </div>

                <ChevronDown
                  class="icon-small transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent class="space-y-1 ml-6 border-l pl-2">
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListCapitalsources, force: true }"
              >
                {{ $t("General.capitalsource") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListContractpartners, force: true }"
              >
                {{ $t("General.contractpartner") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListContractpartnerMatchings, force: true }"
              >
                {{ $t("General.contractpartnerMatchings") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListPreDefMoneyflows, force: true }"
              >
                {{ $t("General.preDefMoneyflows") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListMonthlySettlements, force: true }"
              >
                {{ $t("General.monthlysettlements") }}
              </router-link>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible class="w-full space-y-1">
            <CollapsibleTrigger as-child>
              <div
                class="group flex cursor-pointer items-center justify-between gap-2 p-1 hover:bg-accent rounded-md transition-all"
              >
                <div
                  :class="[
                    'flex items-center gap-2',
                    isMenuActve(DropdownMenus.Etf),
                  ]"
                >
                  <ChartCandlestick :size="20" />
                  <span>{{ $t("General.etfs") }}</span>
                </div>

                <ChevronDown
                  class="icon-small transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent class="space-y-1 ml-6 border-l pl-2">
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListEtfDepot, force: true }"
              >
                {{ $t("General.etfDepot") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListEtfs, force: true }"
              >
                {{ $t("General.etfs") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
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
                <div
                  :class="[
                    'flex items-center gap-2',
                    isMenuActve(DropdownMenus.Profile),
                  ]"
                >
                  <SquareUserRound :size="20" />
                  <span>{{ $t("General.profile") }}</span>
                </div>

                <ChevronDown
                  class="icon-small transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
                />
              </div>
            </CollapsibleTrigger>

            <Separator />
            <CollapsibleContent class="space-y-1 ml-6 border-l pl-2">
              <router-link
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ChangePassword, force: true }"
              >
                {{ $t("User.title.changePassword") }}
              </router-link>
              <router-link
                v-if="isAdmin"
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListPostingAccounts, force: true }"
              >
                {{ $t("General.postingAccounts") }}
              </router-link>
              <router-link
                v-if="isAdmin"
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListUsers, force: true }"
              >
                {{ $t("General.users") }}
              </router-link>
              <router-link
                v-if="isAdmin"
                @click="isMenuOpen = false"
                exact-active-class="bg-muted !text-primary font-medium"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListGroups, force: true }"
              >
                {{ $t("General.groups") }}
              </router-link>
            </CollapsibleContent>
          </Collapsible>

          <div
            class="flex items-center gap-2 p-1 cursor-pointer"
            @click="emit('logout')"
          >
            <LogOut :size="20" />
            {{ $t("General.logout") }}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import SheetDescription from "@/components/ui/sheet/SheetDescription.vue";
import SheetTitle from "@/components/ui/sheet/SheetTitle.vue";
import { DropdownMenus, Routes } from "@/router";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  ChartCandlestick,
  ChartColumnIncreasing,
  ChevronDown,
  Euro,
  ListTodo,
  LogOut,
  Menu,
  Search,
  SquareArrowRightEnter,
  SquarePlus,
  SquareUserRound,
  Table2,
  Wrench,
} from "lucide-vue-next";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { version } from "../../package.json";

const isMenuOpen = ref(false);
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
