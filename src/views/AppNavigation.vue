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
  <AppNavigationMobile
    @logout="logout"
    @show-create-capitalsource-modal="showCreateCapitalsourceModal"
    @show-create-contractpartner-modal="showCreateContractpartnerModal"
    @show-pre-def-moneyflow-modal="showPreDefMoneyflowModal"
  />

  <!-- Desktop Navigation-->
  <AppNavigationDesktop
    @logout="logout"
    @show-create-capitalsource-modal="showCreateCapitalsourceModal"
    @show-create-contractpartner-modal="showCreateContractpartnerModal"
    @show-pre-def-moneyflow-modal="showPreDefMoneyflowModal"
  />

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
import { AxiosSingleton } from "@/config/AxiosSingleton";
import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import router, { Routes } from "@/router";
import { StoreService } from "@/stores/StoreService";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { clearAuthTokens } from "axios-jwt";
import { onMounted, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import AppNavigationDesktop from "./AppNavigationDesktop.vue";
import AppNavigationMobile from "./AppNavigationMobile.vue";

const { t } = useI18n();

const createContractpartnerModalNav = useTemplateRef<
  typeof CreateContractpartnerModalVue
>("createContractpartnerModalNav");
const createCapitalsourceModalNav = useTemplateRef<
  typeof CreateCapitalsourceModalVue
>("createCapitalsourceModalNav");
const createPreDedMoneyflowModalNav = useTemplateRef<
  typeof CreatePreDefMoneyflowModalVue
>("createPreDedMoneyflowModalNav");

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
