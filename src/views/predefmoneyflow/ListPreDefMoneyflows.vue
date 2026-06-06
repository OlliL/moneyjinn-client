<template>
  <DeletePreDefMoneyflowModal />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.preDefMoneyflows") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('PreDefMoneyflow.searchBy')"
      @createClicked="actions.create"
    />

    <ListPreDefMoneyflowsMobile :pre-def-moneyflows="preDefMoneyflows" />

    <ListPreDefMoneyflowsDesktop :pre-def-moneyflows="preDefMoneyflows" />
  </div>
</template>

<script lang="ts" setup>
import DivFilter from "@/components/common/DivFilter.vue";
import { useCreatePreDefMoneyflowModalStore } from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.store";
import {
  PreDefMoneyflowActionsKey,
  type CrudActions,
} from "@/model/CrudActions";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { onMounted, provide, ref, watch } from "vue";
import { useDeletePreDefMoneyflowModalStore } from "./elements/DeletePreDefMoneyflowModal.store";
import DeletePreDefMoneyflowModal from "./elements/DeletePreDefMoneyflowModal.vue";
import ListPreDefMoneyflowsDesktop from "./elements/ListPreDefMoneyflowsDesktop.vue";
import ListPreDefMoneyflowsMobile from "./elements/ListPreDefMoneyflowsMobile.vue";

const preDefMoneyflows = ref(new Array<PreDefMoneyflow>());
const allPreDefMoneyflows = ref(new Array<PreDefMoneyflow>());
const searchString = ref("");

const { openCreatePreDefMoneyflow, openEditPreDefMoneyflow } =
  useCreatePreDefMoneyflowModalStore();
const { openDelete: openDeletePreDefMoneyflow } =
  useDeletePreDefMoneyflowModalStore();

const actions: CrudActions<PreDefMoneyflow> = {
  create: () => openCreatePreDefMoneyflow(reloadView),
  edit: (mpm) => openEditPreDefMoneyflow(mpm, reloadView),
  delete: (mpm) => openDeletePreDefMoneyflow(mpm, reloadView),
};

provide(PreDefMoneyflowActionsKey, actions);

watch(searchString, () => searchContent());

const searchContent = () => {
  if (searchString.value === "") {
    preDefMoneyflows.value = allPreDefMoneyflows.value;
    return;
  }

  const commentUpper = searchString.value.toUpperCase();
  preDefMoneyflows.value = allPreDefMoneyflows.value.filter((entry) =>
    entry.contractpartnerName
      ? entry.contractpartnerName.toUpperCase().includes(commentUpper)
      : true,
  );
};

const reloadView = () => {
  PreDefMoneyflowService.fetchAllPreDefMoneyflow()
    .then((_preDefMoneyflows) => {
      _preDefMoneyflows.sort((a, b) => {
        if (!a.contractpartnerName && !b.contractpartnerName) return 0;
        else if (!a.contractpartnerName) return -1;
        else if (!b.contractpartnerName) return 1;

        return a.contractpartnerName
          .toUpperCase()
          .localeCompare(b.contractpartnerName.toUpperCase());
      });
      allPreDefMoneyflows.value = _preDefMoneyflows;
      searchContent();
    })
    .catch((backendError) => {
      handleBackendError(backendError);
    });
};

onMounted(() => {
  searchString.value = "";
  reloadView();
});
</script>
