<template>
  <!-- Mobile Navigation-->
  <AppNavigationMobile
    @logout="logout"
    @show-create-contractpartner-modal="showCreateContractpartnerModal"
    @show-pre-def-moneyflow-modal="showPreDefMoneyflowModal"
  />

  <!-- Desktop Navigation-->
  <AppNavigationDesktop
    @logout="logout"
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
import { AxiosSingleton } from "@/config/AxiosSingleton";
import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import router, { Routes } from "@/router";
import { useCreateContractpartnerModalStore } from "@/components/contractpartner/CreateContractpartnerModal.store";
import { useCreatePreDefMoneyflowModalStore } from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.store";
import { StoreService } from "@/stores/StoreService";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { clearAuthTokens } from "axios-jwt";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import AppNavigationDesktop from "./AppNavigationDesktop.vue";
import AppNavigationMobile from "./AppNavigationMobile.vue";

const { t } = useI18n();

const { openCreatePreDefMoneyflow } = useCreatePreDefMoneyflowModalStore();
const { openCreateContractpartner } = useCreateContractpartnerModalStore();

const showCreateContractpartnerModal = () => {
  openCreateContractpartner();
};
const showPreDefMoneyflowModal = () => {
  openCreatePreDefMoneyflow();
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
