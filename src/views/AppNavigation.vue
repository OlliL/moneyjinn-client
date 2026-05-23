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
        <SheetHeader> </SheetHeader>
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
                <div class="flex items-center gap-2">
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
                  class="icon-small transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
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
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListCapitalsources, force: true }"
              >
                {{ $t("General.capitalsource") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListContractpartners, force: true }"
              >
                {{ $t("General.contractpartner") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListContractpartnerMatchings, force: true }"
              >
                {{ $t("General.contractpartnerMatchings") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
                class="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md !text-foreground !no-underline"
                :to="{ name: Routes.ListPreDefMoneyflows, force: true }"
              >
                {{ $t("General.preDefMoneyflows") }}
              </router-link>
              <router-link
                @click="isMenuOpen = false"
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
                <div class="flex items-center gap-2">
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
                  class="icon-small transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
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
          <span class="cursor-pointer" @click="showCreateCapitalsourceModal">{{
            $t("General.capitalsource")
          }}</span>
        </MenubarItem>
        <MenubarItem as-child>
          <span
            class="cursor-pointer"
            @click="showCreateContractpartnerModal"
            >{{ $t("General.contractpartner") }}</span
          >
        </MenubarItem>
        <MenubarItem as-child>
          <span class="cursor-pointer" @click="showPreDefMoneyflowModal">{{
            $t("General.preDefMoneyflow")
          }}</span>
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
        <MenubarSeparator v-if="userIsAdmin" />
        <MenubarItem as-child class="cursor-pointer" v-if="userIsAdmin">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListPostingAccounts, force: true }"
            >{{ $t("General.postingAccounts") }}</router-link
          >
        </MenubarItem>
        <MenubarSeparator v-if="userIsAdmin" />
        <MenubarItem as-child class="cursor-pointer" v-if="userIsAdmin">
          <router-link
            class="text-foreground no-underline transition-colors hover:text-primary"
            exact-active-class="bg-muted text-primary font-medium"
            :to="{ name: Routes.ListUsers, force: true }"
            >{{ $t("General.users") }}</router-link
          >
        </MenubarItem>
        <MenubarItem as-child class="cursor-pointer" v-if="userIsAdmin">
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
        ><span
          ><LogOut class="m-2 text-muted-foreground" @click="logout" /></span
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
import { LogoutApi } from "@/api";
import CreateCapitalsourceModalVue from "@/components/capitalsource/CreateCapitalsourceModal.vue";
import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import CreatePreDefMoneyflowModalVue from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.vue";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AxiosSingleton } from "@/config/AxiosSingleton";
import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import router, { DropdownMenus, Routes } from "@/router";
import { StoreService } from "@/stores/StoreService";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { clearAuthTokens } from "axios-jwt";
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
import { onMounted, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { version } from "../../package.json";

const { t } = useI18n();

const isMenuOpen = ref(false);
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const userIsAdmin = ref(false);
const route = useRoute();

const createContractpartnerModalNav = useTemplateRef<
  typeof CreateContractpartnerModalVue
>("createContractpartnerModalNav");
const createCapitalsourceModalNav = useTemplateRef<
  typeof CreateCapitalsourceModalVue
>("createCapitalsourceModalNav");
const createPreDedMoneyflowModalNav = useTemplateRef<
  typeof CreatePreDefMoneyflowModalVue
>("createPreDedMoneyflowModalNav");

const isMenuActve = (menu: DropdownMenus) => {
  return route.meta?.activeMenu === menu ? "router-link-active" : "";
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
</script>

<style scoped>
@reference "@/style.css";

:deep(.router-link-active svg) {
  @apply !stroke-primary;
  stroke-width: 2.5px !important;
}
</style>
