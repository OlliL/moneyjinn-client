<template>
  <CreatePreDefMoneyflowModalVue
    ref="createPreDefMoneyflowModalList"
    id-suffix="List"
    @pre-def-moneyflow-created="reloadView"
    @pre-def-moneyflow-updated="reloadView"
  />
  <DeletePreDefMoneyflowModalVue
    ref="deleteModal"
    id-suffix="List"
    @pre-def-moneyflow-deleted="reloadView"
  />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.preDefMoneyflows") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('PreDefMoneyflow.searchBy')"
      @createClicked="showCreatePreDefMoneyflowModal"
    />

    <DivError :server-errors="serverErrors" />

    <DivContentTable>
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.amount")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.contractpartner")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.comment")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.postingAccount")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.capitalsource")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("PreDefMoneyflow.onceAMonthShort")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("PreDefMoneyflow.createDate")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("PreDefMoneyflow.lastUsed")
          }}</TableHead>
          <TableHead class="border" colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ListPreDefMoneyflowRowVue
          v-for="mpm in preDefMoneyflows"
          :key="mpm.id"
          :mpm="mpm"
          @edit-pre-def-moneyflow="editPreDefMoneyflow"
          @delete-pre-def-moneyflow="deletePreDefMoneyflow"
        />
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, useTemplateRef } from "vue";

import DivContentTable from "@/components/DivContentTable.vue";
import DivError from "@/components/DivError.vue";
import DivFilter from "@/components/DivFilter.vue";
import CreatePreDefMoneyflowModalVue from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.vue";
import DeletePreDefMoneyflowModalVue from "@/components/predefmoneyflow/DeletePreDefMoneyflowModal.vue";
import ListPreDefMoneyflowRowVue from "@/components/predefmoneyflow/ListPreDefMoneyflowRow.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";

import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const preDefMoneyflows = ref(new Array<PreDefMoneyflow>());
const allPreDefMoneyflows = ref(new Array<PreDefMoneyflow>());
const searchString = ref("");

const createPreDefMoneyflowModalList = useTemplateRef<
  typeof CreatePreDefMoneyflowModalVue
>("createPreDefMoneyflowModalList");
const deleteModal =
  useTemplateRef<typeof DeletePreDefMoneyflowModalVue>("deleteModal");

const showCreatePreDefMoneyflowModal = () => {
  createPreDefMoneyflowModalList.value?._show();
};

const deletePreDefMoneyflow = (mcs: PreDefMoneyflow) => {
  deleteModal.value?._show(mcs);
};

const editPreDefMoneyflow = (mcs: PreDefMoneyflow) => {
  createPreDefMoneyflowModalList.value?._show(mcs);
};

watch(searchString, () => {
  searchContent();
});

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
  serverErrors.value = new Array<string>();

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
      handleBackendError(backendError, serverErrors);
    });
};

onMounted(() => {
  searchString.value = "";
  reloadView();
});
</script>
